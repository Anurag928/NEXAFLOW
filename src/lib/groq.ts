import Groq from "groq-sdk";

// Initialize Groq client. This runs strictly server-side.
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

export interface ContextGenerationResult {
  title: string;
  summary: string;
  generatedPrompt: string;
}

export async function generateContext(
  conversationText: string,
  sourceModel: string,
  targetModel: string
): Promise<ContextGenerationResult> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured in environment variables.");
  }

  const cleanSource = sourceModel.toUpperCase();
  const cleanTarget = targetModel.toUpperCase();

  // Target-specific optimizations & titles
  let optimizationDetail = "";

  switch (targetModel.toLowerCase()) {
    case "gemini":
      optimizationDetail = "- Make the prompt highly structured, clear, detailed, and research-friendly.\n- Format data logically so Google Gemini can easily outline steps and reason over the full history.";
      break;
    case "claude":
      optimizationDetail = "- Make the prompt reasoning-oriented, highly detailed, and deep in technical context.\n- Format data to preserve long conversation contexts and enable Anthropic Claude to process details cleanly.";
      break;
    case "deepseek":
      optimizationDetail = "- Make the prompt heavily coding-focused, code-dense, and highly technical.\n- Emphasize error traces, code syntax rules, frameworks, and structural bug fixes.";
      break;
    case "grok":
      optimizationDetail = "- Make the prompt concise, direct, and conversational.\n- Cut out wordy preambles, focusing strictly on immediate user intent and quick feedback.";
      break;
    case "chatgpt":
    default:
      optimizationDetail = "- Make the prompt instruction-rich, custom system-level directive heavy, outlining exact rules, persona definitions, and clear task-oriented boundaries.";
      break;
  }

  const systemPrompt = `You are NexaFlow, an AI conversation portability system.
Your task is to analyze an exported AI conversation and create a continuation prompt that allows another AI model (destination model: ${cleanTarget}) to continue naturally.

You MUST respond with a JSON object in this exact schema structure:
{
  "title": "A short, concise conversation title (3-8 words maximum) based on the user's original discussion. E.g. 'Firebase Authentication Debugging' or 'React Dashboard Development'. Never use generic titles, do not mention AI assistants, and do not include phrases like 'Continue previous conversation', 'Existing conversation', or 'AI assistant'.",
  "summary": "A short 1-2 sentence preview description summarizing the active development stage, blocker, or task.",
  "generatedPrompt": "A detailed continuation prompt that allows the destination AI to continue the exact same work without losing context. Must start with '# CONTINUE PREVIOUS AI CONVERSATION' and follow with sections for CONVERSATION TYPE, MAIN CONTEXT, PREVIOUS DISCUSSION, KNOWLEDGE STATE, IMPORTANT DETAILS, CURRENT POSITION, NEXT CONTINUATION TASK, and FINAL CONTINUATION PROMPT."
}

====================================================
RULES FOR TITLE & SUMMARY
====================================================
1. Do not use generic titles.
2. Return a title of 3-8 words maximum.
3. The title should represent the actual conversation topic.
4. Do not include phrases like "Continue previous conversation", "Existing conversation", or "AI assistant".

====================================================
RULES FOR GENERATEDPROMPT
====================================================
- Maintain previous decisions, stack details, and user preferences.
- Preserve accuracy over complexity.
- Classification headers must be capitalized.
- Optimization instructions for ${cleanTarget}:
${optimizationDetail}`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Here is the conversation text to convert:\n\n${conversationText}` },
    ],
    temperature: 0.2,
  });

  try {
    const rawContent = response.choices[0]?.message?.content || "";
    const parsed = JSON.parse(rawContent);
    return {
      title: parsed.title || "AI Conversation Transfer",
      summary: parsed.summary || "Transferred conversation contexts successfully.",
      generatedPrompt: parsed.generatedPrompt || rawContent,
    };
  } catch (err) {
    console.error("Failed to parse JSON response from Groq:", err);
    return {
      title: "AI Conversation Transfer",
      summary: "Transferred conversation contexts successfully.",
      generatedPrompt: response.choices[0]?.message?.content || "",
    };
  }
}
