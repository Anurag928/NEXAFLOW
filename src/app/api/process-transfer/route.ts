import { NextResponse } from "next/server";
import { extractConversation } from "@/lib/conversationExtractor";
import { generateContext } from "@/lib/groq";
import { ModelId } from "@/components/ModelSelector";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { inputType, shareUrl, textValue, fileContent, targetModel, userId } = body;

    if (!targetModel) {
      return NextResponse.json(
        { error: "Missing destination model selection." },
        { status: 400 }
      );
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

    let conversationText = "";
    let sourceModel: ModelId = "chatgpt";

    if (inputType === "link") {
      if (!shareUrl) {
        return NextResponse.json(
          { error: "Missing share URL." },
          { status: 400 }
        );
      }
      const extracted = await extractConversation(shareUrl);
      conversationText = extracted.conversationText;
      sourceModel = extracted.sourceModel;
    } else if (inputType === "text") {
      if (!textValue) {
        return NextResponse.json(
          { error: "Text content is empty." },
          { status: 400 }
        );
      }
      conversationText = textValue;
      // Infer source model from text content keywords
      const textLower = textValue.toLowerCase();
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
    } else if (inputType === "file") {
      if (!fileContent) {
        return NextResponse.json(
          { error: "Uploaded file content is empty." },
          { status: 400 }
        );
      }
      conversationText = fileContent;
      // Infer source model from file content keywords
      const textLower = fileContent.toLowerCase();
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
    } else {
      return NextResponse.json(
        { error: "Invalid input type." },
        { status: 400 }
      );
    }

    if (!conversationText.trim()) {
      return NextResponse.json(
        { error: "Conversation content is empty." },
        { status: 400 }
      );
    }

    console.log("Extracted conversation:", conversationText);
    console.log("Sending to Groq...");

    // Call Groq AI layer strictly on the server-side to generateportable context package
    const generatedContext = await generateContext(
      conversationText,
      sourceModel,
      targetModel
    );

    // Deduct credit for free user
    if (userId && userId !== "anonymous" && isFreeUser && userDocRef) {
      await updateDoc(userDocRef, {
        "credits.used": increment(1)
      });
    }

    return NextResponse.json({
      success: true,
      sourceModel,
      targetModel,
      destinationModel: targetModel,
      generatedContext,
      generatedPrompt: generatedContext,
    });
  } catch (err: any) {
    console.error("[api/process-transfer] processing error:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred during context transfer." },
      { status: 500 }
    );
  }
}
