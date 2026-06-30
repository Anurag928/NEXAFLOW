import { ModelId } from "@/components/ModelSelector";
import { extractChatGPT } from "./extractors/chatgptExtractor";
import { extractGemini } from "./extractors/geminiExtractor";
import { extractClaude } from "./extractors/claudeExtractor";
import { extractDeepSeek } from "./extractors/deepseekExtractor";
import { extractGrok } from "./extractors/grokExtractor";
import { ExtractorMessage } from "./extractors/helper";

interface ExtractedConversation {
  conversationText: string;
  sourceModel: ModelId;
  messagesCount: number;
  messages: ExtractorMessage[];
}

export async function extractConversation(
  shareUrl: string,
  signal?: AbortSignal
): Promise<ExtractedConversation> {
  if (!shareUrl) {
    throw new Error("Share URL is empty.");
  }

  // Detect platform and detect source model
  let sourceModel: ModelId = "chatgpt";
  const urlLower = shareUrl.toLowerCase();

  if (urlLower.includes("chatgpt.com") || urlLower.includes("openai.com")) {
    sourceModel = "chatgpt";
  } else if (urlLower.includes("gemini.google.com") || urlLower.includes("google.com/gemini") || urlLower.includes("g.co/gemini")) {
    sourceModel = "gemini";
  } else if (urlLower.includes("claude.ai") || urlLower.includes("anthropic.com")) {
    sourceModel = "claude";
  } else if (urlLower.includes("deepseek.com")) {
    sourceModel = "deepseek";
  } else if (urlLower.includes("grok.com") || urlLower.includes("x.ai")) {
    sourceModel = "grok";
  }

  console.log(`[1] URL received: ${shareUrl}`);
  console.log(`[2] Platform detected: ${sourceModel.toUpperCase()}`);

  try {
    const response = await fetch(shareUrl, {
      signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page: HTTP status ${response.status}`);
    }

    const html = await response.text();
    let result = { success: false, messages: [] as ExtractorMessage[] };

    if (sourceModel === "chatgpt") {
      result = await extractChatGPT(shareUrl, html);
    } else if (sourceModel === "gemini") {
      result = await extractGemini(shareUrl, html);
    } else if (sourceModel === "claude") {
      result = await extractClaude(shareUrl, html);
    } else if (sourceModel === "deepseek") {
      result = await extractDeepSeek(shareUrl, html);
    } else if (sourceModel === "grok") {
      result = await extractGrok(shareUrl, html);
    }

    if (!result.success || result.messages.length === 0) {
      throw new Error("Unable to extract conversation messages from this link.");
    }

    console.log(`[4] Messages found: ${result.messages.length}`);

    // Format the messages for Groq input format
    let conversationText = result.messages.map(m => {
      const roleLabel = m.role === "user" ? "User" : "Assistant";
      return `${roleLabel}:\n${m.content}`;
    }).join("\n\n");

    console.log(`[5] Extracted text length: ${conversationText.length}`);

    if (conversationText.length > 50000) {
      conversationText = conversationText.substring(0, 49800) + "\n\n... [Conversation truncated for optimization] ...";
    }

    return {
      conversationText,
      sourceModel,
      messagesCount: result.messages.length,
      messages: result.messages,
    };
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Conversation processing took too long. Please try again.");
    }
    console.error(`[conversationExtractor] Extraction failed:`, error.message || error);
    throw error;
  }
}
