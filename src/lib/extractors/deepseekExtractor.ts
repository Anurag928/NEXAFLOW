import { ExtractorResult, extractJsonFromHtml, findMessagesInAnyJSON, fallbackHtmlScrape } from "./helper";
import { browserFallbackExtract } from "./browserFallback";

export async function extractDeepSeek(shareUrl: string, html: string): Promise<ExtractorResult> {
  const jsonObjects = extractJsonFromHtml(html);
  
  for (const data of jsonObjects) {
    const messages = findMessagesInAnyJSON(data);
    if (messages && messages.length > 0) {
      console.log(`[3] Extraction method used: DeepSeek Script JSON`);
      return { success: true, messages };
    }
  }

  const browserMessages = await browserFallbackExtract(shareUrl, "deepseek");
  if (browserMessages && Array.isArray(browserMessages) && browserMessages.length > 0) {
    return { success: true, messages: browserMessages };
  }

  const fallbackMessages = fallbackHtmlScrape(html);
  if (fallbackMessages.length > 0) {
    console.log(`[3] Extraction method used: DeepSeek HTML Scrape Fallback`);
    return { success: true, messages: fallbackMessages };
  }

  return { success: false, messages: [] };
}
