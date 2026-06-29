import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

export interface ExtractedMemory {
  category: "project" | "preference" | "decision" | "context";
  title: string;
  content: string;
  important: boolean;
  metadata?: {
    status?: string;
    stack?: string[];
  };
}

/**
 * Uses Groq API to analyze a conversation transcript and extract important memories.
 */
export async function extractMemoryFromConversation(conversationText: string): Promise<ExtractedMemory[]> {
  if (!process.env.GROQ_API_KEY) {
    console.warn("GROQ_API_KEY is not configured. Memory extraction will return empty array.");
    return [];
  }

  const systemPrompt = `You are NexaFlow AI Memory Agent.
Your job is to analyze a conversation transcript between a developer and an AI assistant, and extract important context to be saved for future interactions.

Extract the following categories of memories:
1. "project": Any software project, app, or tool being built. Include stack/technologies (e.g., Next.js, Firebase) in the metadata block.
2. "preference": User preferences, developer coding styles, explanation preferences, design guidelines.
3. "decision": Specific architectural, libraries, databases, or deployment decisions made.
4. "context": General domain logic, features, business rules, or key conversation facts.

You must return ONLY a JSON array containing the extracted memories. Do not include any markdown formatting, preambles, or conversational filler. The output must be directly parseable as JSON.

Format for each item in the array:
{
  "category": "project" | "preference" | "decision" | "context",
  "title": "Short, clear title",
  "content": "Specific memory detail, instruction, or stacked detail. Be descriptive but concise.",
  "important": true or false,
  "metadata": {
    "status": "Active" | "Completed" | "Archived",
    "stack": ["Next.js", "TypeScript", "Firebase"]
  }
}

If no memories of a certain category can be found, do not return dummy data. Extract only actual, factual context. Limit the output to a maximum of 5 high-quality memories total.`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Here is the conversation transcript:\n\n${conversationText}` },
      ],
      temperature: 0.1,
    });

    const text = response.choices[0]?.message?.content || "";
    
    // Clean up potential markdown wrappers
    let jsonStr = text.trim();
    if (jsonStr.startsWith("```")) {
      const firstLineBreak = jsonStr.indexOf("\n");
      const lastBackticks = jsonStr.lastIndexOf("```");
      if (firstLineBreak !== -1 && lastBackticks !== -1) {
        jsonStr = jsonStr.substring(firstLineBreak, lastBackticks).trim();
      }
    }

    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed)) {
      return parsed as ExtractedMemory[];
    }
    return [];
  } catch (error) {
    console.error("Error extracting memory from conversation via Groq:", error);
    return [];
  }
}
