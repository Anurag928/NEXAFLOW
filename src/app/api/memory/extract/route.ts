import { NextResponse } from "next/server";
import { extractMemoryFromConversation } from "@/lib/memoryExtractor";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversationText, userId, source } = body;

    if (!conversationText || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: conversationText and userId." },
        { status: 400 }
      );
    }

    console.log(`[AI Memory Extraction] Starting for user ${userId}...`);
    const memories = await extractMemoryFromConversation(conversationText);
    console.log(`[AI Memory Extraction] Extracted ${memories.length} memories.`);

    const savedMemories = [];
    for (const mem of memories) {
      const docRef = await addDoc(collection(db, "memory"), {
        userId,
        category: mem.category,
        title: mem.title,
        content: mem.content,
        important: mem.important || false,
        source: source || "AI Extraction",
        metadata: mem.metadata || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      savedMemories.push({ id: docRef.id, ...mem });
    }

    return NextResponse.json({
      success: true,
      count: savedMemories.length,
      memories: savedMemories,
    });
  } catch (error: any) {
    console.error("Error in /api/memory/extract:", error);
    return NextResponse.json(
      { error: error.message || "Failed to extract memory." },
      { status: 500 }
    );
  }
}
