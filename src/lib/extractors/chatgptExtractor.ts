import { ExtractorResult, extractJsonFromHtml, findMessagesInAnyJSON, traverseChatGPTMapping, fallbackHtmlScrape } from "./helper";
import { browserFallbackExtract } from "./browserFallback";

export async function extractChatGPT(shareUrl: string, html: string): Promise<ExtractorResult> {
  // Strategy 1: Check server HTML for embedded Next.js or Remix JSON serialized state
  const jsonObjects = extractJsonFromHtml(html);
  
  for (const data of jsonObjects) {
    // Look for ChatGPT mapping structure inside parsed scripts
    // First, look for standard sharedConversationResponse object
    if (data.props?.pageProps?.sharedConversationResponse?.mapping) {
      const mapping = data.props.pageProps.sharedConversationResponse.mapping;
      const currentNodeId = data.props.pageProps.sharedConversationResponse.current_node;
      const messages = traverseChatGPTMapping(mapping, currentNodeId);
      const title = data.props.pageProps.sharedConversationResponse.title || "";
      
      if (messages.length > 0) {
        console.log(`[3] Extraction method used: ChatGPT NextData JSON`);
        return { success: true, title, messages };
      }
    }
    
    // Look for state mapping in RemixContext or state loaders
    const sharedConvo = findSharedConversationRecursive(data);
    if (sharedConvo && sharedConvo.mapping) {
      const messages = traverseChatGPTMapping(sharedConvo.mapping, sharedConvo.current_node);
      const title = sharedConvo.title || "";
      
      if (messages.length > 0) {
        console.log(`[3] Extraction method used: ChatGPT Remix JSON`);
        return { success: true, title, messages };
      }
    }
  }

  // Strategy 2: Scan recursively for any conversation-like message lists in scripts
  for (const data of jsonObjects) {
    const messages = findMessagesInAnyJSON(data);
    if (messages && messages.length > 0) {
      console.log(`[3] Extraction method used: ChatGPT Script Scan JSON`);
      return { success: true, messages };
    }
  }

  // Strategy 3: Dynamic Render Browser automation fallback (Playwright / Puppeteer)
  const browserMessages = await browserFallbackExtract(shareUrl, "chatgpt");
  if (browserMessages && Array.isArray(browserMessages) && browserMessages.length > 0) {
    return { success: true, messages: browserMessages };
  }

  // Fallback Strategy 4: HTML Scrape fallback
  const fallbackMessages = fallbackHtmlScrape(html);
  if (fallbackMessages.length > 0) {
    console.log(`[3] Extraction method used: ChatGPT HTML Scrape Fallback`);
    return { success: true, messages: fallbackMessages };
  }

  return { success: false, messages: [] };
}

function findSharedConversationRecursive(obj: any): any {
  if (!obj || typeof obj !== "object") return null;
  if (obj.sharedConversationResponse) {
    return obj.sharedConversationResponse;
  }
  if (obj.mapping && obj.title !== undefined) {
    return obj;
  }
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const res = findSharedConversationRecursive(obj[key]);
      if (res) return res;
    }
  }
  return null;
}
