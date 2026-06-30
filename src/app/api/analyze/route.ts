import { NextResponse } from "next/server";
import { extractConversation } from "@/lib/conversationExtractor";
import { generateContext } from "@/lib/groq";
import { ModelId } from "@/components/ModelSelector";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { extractMemoryFromConversation } from "@/lib/memoryExtractor";

export async function POST(request: Request) {
  let shareUrl: string | null = null;
  let userId: string = "anonymous";
  let targetModel: ModelId = "gemini";
  let inputType: "link" | "text" | "file" = "link";
  let textValue: string | null = null;
  let fileContent: string | null = null;

  try {
    const body = await request.json();
    shareUrl = body.shareUrl || null;
    userId = body.userId || "anonymous";
    targetModel = body.targetModel || "gemini";
    inputType = body.inputType || "link";
    textValue = body.textValue || null;
    fileContent = body.fileContent || null;

    console.log("[1] URL received:", inputType === "link" ? shareUrl : `[Raw Input: ${inputType}]`);

    if (!targetModel) {
      return NextResponse.json({ error: "Missing destination model." }, { status: 400 });
    }

    // Validate credits before proceeding
    let userDocRef: any = null;
    let isFreeUser = true;

    if (userId && userId !== "anonymous") {
      userDocRef = doc(db, "users", userId);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const userData = userSnap.data() as any;
        const plan = userData.plan || "free";
        const credits = userData.credits || { total: 5, used: 0 };
        isFreeUser = plan === "free";

        if (isFreeUser && credits.used >= 5) {
          return NextResponse.json({
            success: false,
            error: "FREE_LIMIT_REACHED",
            message: "Your free transfers are complete. Upgrade to continue."
          }, { status: 403 });
        }
      }
    }

    // Step 8: Cache results for share link
    if (inputType === "link" && shareUrl) {
      console.log("[Cache Check] Querying transfers for duplicate URL...");
      const q = query(
        collection(db, "transfers"),
        where("shareLink", "==", shareUrl),
        where("status", "==", "completed")
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const cachedDoc = querySnapshot.docs[0];
        const cachedData = cachedDoc.data();
        console.log("[Cache Hit] Found completed transfer prompt in Firestore cache. ID:", cachedDoc.id);
        
        // Generate another document clone for the current user's profile list so it shows in their dashboard
        const clonedRef = await addDoc(collection(db, "transfers"), {
          userId,
          title: cachedData.title || (cachedData.generatedPrompt ? generateTitleFromText(cachedData.generatedPrompt) : "AI Conversation Transfer"),
          summary: cachedData.summary || (cachedData.generatedPrompt ? generateSummaryFromText(cachedData.generatedPrompt) : "Transferred conversation contexts successfully."),
          sourceModel: cachedData.sourceModel || "chatgpt",
          targetModel: targetModel,
          destinationModel: targetModel,
          originalUrl: shareUrl,
          shareLink: shareUrl,
          inputType: "link",
          status: "completed",
          generatedPrompt: cachedData.generatedPrompt || cachedData.generatedContext || "",
          generatedContext: cachedData.generatedPrompt || cachedData.generatedContext || "",
          createdAt: serverTimestamp(),
          completedAt: serverTimestamp(),
        });

        // Deduct credit for free user
        if (userId && userId !== "anonymous" && isFreeUser && userDocRef) {
          await updateDoc(userDocRef, {
            "credits.used": increment(1)
          });
        }

        console.log("[7] Result returned (from Cache clone)");
        return NextResponse.json({
          success: true,
          id: clonedRef.id,
          prompt: cachedData.generatedPrompt || cachedData.generatedContext || "",
          cached: true,
        });
      }
      console.log("[Cache Miss] No completed transfer matching this link found.");
    }

    let conversationText = "";
    let sourceModel: ModelId = "chatgpt";
    let messagesCount = 0;
    let hasUserMessage = true;
    let hasAssistantMessage = true;

    // Step 2 & 4: Extraction with Timeouts
    if (inputType === "link") {
      if (!shareUrl) {
        return NextResponse.json({
          error: "NO_MESSAGES_FOUND"
        }, { status: 400 });
      }

      console.log(`[1] URL received: ${shareUrl}`);
      
      // AbortController to implement the 15-second fetch timeout limit
      const controller = new AbortController();
      const fetchTimeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        const extracted = await extractConversation(shareUrl, controller.signal);
        clearTimeout(fetchTimeoutId);
        conversationText = extracted.conversationText;
        sourceModel = extracted.sourceModel;
        messagesCount = extracted.messagesCount;
        hasUserMessage = extracted.messages.some(m => m.role === "user");
        hasAssistantMessage = extracted.messages.some(m => m.role === "assistant");
      } catch (err: any) {
        clearTimeout(fetchTimeoutId);
        return NextResponse.json({
          error: "NO_MESSAGES_FOUND"
        }, { status: 400 });
      }
    } else {
      console.log("[1] URL received: [Editor Raw Input]");
      console.log(`[2] Platform detected: ${inputType.toUpperCase()}`);
      console.log(`[3] Extraction method used: Direct Input Ingestion`);
      
      conversationText = inputType === "text" ? textValue || "" : fileContent || "";
      messagesCount = conversationText.trim().length > 0 ? 1 : 0;
      
      // Infer source model from content keywords
      const textLower = conversationText.toLowerCase();
      if (textLower.includes("claude") || textLower.includes("anthropic")) {
        sourceModel = "claude";
      } else if (textLower.includes("gemini") || textLower.includes("google")) {
        sourceModel = "gemini";
      } else if (textLower.includes("deepseek")) {
        sourceModel = "deepseek";
      } else if (textLower.includes("grok") || textLower.includes("xai")) {
        sourceModel = "grok";
      } else {
        sourceModel = "chatgpt";
      }
      console.log(`[4] Messages found: [Raw Text Block]`);
      console.log(`[5] Extracted text length: ${conversationText.length}`);
    }

    if (messagesCount === 0 || !conversationText || conversationText.trim().length === 0) {
      return NextResponse.json({
        error: "NO_MESSAGES_FOUND"
      }, { status: 400 });
    }

    console.log("[6] Groq request started");

    console.log("RAW URL:", shareUrl || "");
    console.log("EXTRACTED CONTENT:");
    console.log(conversationText);
    console.log("CONTENT LENGTH:", conversationText.length);
    console.log(conversationText);

    // Step 4: Groq API with 30-second timeout limit
    const groqPromise = generateContext(conversationText, sourceModel, targetModel);
    const timeoutPromise = new Promise<any>((_, reject) =>
      setTimeout(() => reject(new Error("Conversation processing took too long. Please try again.")), 30000)
    );

    const result = await Promise.race([groqPromise, timeoutPromise]);

    console.log(`[7] Groq response received: ${JSON.stringify(result).substring(0, 150)}...`);

    // Create completed document in Firestore transfers collection
    const docRef = await addDoc(collection(db, "transfers"), {
      userId,
      title: result.title,
      summary: result.summary,
      sourceModel,
      targetModel, // kept for backwards compatibility
      destinationModel: targetModel,
      originalUrl: shareUrl, // kept for backwards compatibility
      shareLink: shareUrl,
      inputType,
      textValue: inputType === "text" ? textValue : null,
      fileContent: inputType === "file" ? fileContent : null,
      status: "completed",
      generatedPrompt: result.generatedPrompt,
      generatedContext: result.generatedPrompt, // kept for backwards compatibility
      createdAt: serverTimestamp(),
      completedAt: serverTimestamp(),
    });

    // Deduct credit for free user
    if (userId && userId !== "anonymous" && isFreeUser && userDocRef) {
      await updateDoc(userDocRef, {
        "credits.used": increment(1)
      });
    }

    // Trigger memory extraction in the background (non-blocking)
    if (userId && userId !== "anonymous" && conversationText) {
      extractMemoryFromConversation(conversationText)
        .then(async (memories) => {
          for (const mem of memories) {
            await addDoc(collection(db, "memory"), {
              userId,
              category: mem.category,
              title: mem.title,
              content: mem.content,
              important: mem.important || false,
              source: `Transfer ${docRef.id.substring(0, 6)}`,
              metadata: mem.metadata || null,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          }
          console.log(`[Background Memory Extraction] Extracted and saved ${memories.length} memories for user ${userId}`);
        })
        .catch((err) => {
          console.error("[Background Memory Extraction] Failed:", err);
        });
    }

    return NextResponse.json({
      success: true,
      id: docRef.id,
      prompt: result.generatedPrompt,
    });

  } catch (err: any) {
    console.error("[api/analyze] error encountered:", err.message || err);
    return NextResponse.json({
      success: false,
      error: "EXTRACTION_FAILED",
      message: err.message || "Unable to extract conversation messages from this link."
    }, { status: 500 });
  }
}

function generateTitleFromText(text: string): string {
  if (!text) return "AI Conversation Transfer";
  const lower = text.toLowerCase();
  
  if (lower.includes("firebase") && lower.includes("auth")) return "Firebase Authentication Fix";
  if (lower.includes("next.js") && lower.includes("route")) return "Next.js App Router Setup";
  if (lower.includes("react") && lower.includes("state")) return "React State Management Bug";
  if (lower.includes("tailwind")) return "Tailwind CSS Styling Setup";
  if (lower.includes("prisma") || lower.includes("postgresql")) return "Prisma Database Setup";
  if (lower.includes("docker")) return "Docker Container Configuration";
  if (lower.includes("api") && lower.includes("endpoint")) return "API Endpoint Integration";
  if (lower.includes("machine learning") || lower.includes("cnn")) return "Machine Learning Architecture";
  
  // Find first clean line or first few words
  const cleanText = text.replace(/[#*`"']/g, "").trim();
  const words = cleanText.split(/\s+/).filter(w => w.length > 1).slice(0, 5);
  if (words.length > 2) {
    return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }
  return "AI Conversation Migration";
}

function generateSummaryFromText(text: string): string {
  if (!text) return "Transferred conversation contexts successfully.";
  const cleanText = text.replace(/^(user|assistant|system):/i, "").trim().replace(/[#*`"']/g, "");
  if (cleanText.length <= 100) return cleanText;
  return cleanText.substring(0, 97) + "...";
}
