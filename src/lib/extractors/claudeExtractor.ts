import { ExtractorResult, extractJsonFromHtml, findMessagesInAnyJSON, fallbackHtmlScrape } from "./helper";
import { browserFallbackExtract } from "./browserFallback";

export async function extractClaude(shareUrl: string, html: string): Promise<ExtractorResult> {
  // Strategy 1: Check embedded Gatsby / Next data for Claude shared links
  const jsonObjects = extractJsonFromHtml(html);
  
  for (const data of jsonObjects) {
    const messages = findMessagesInAnyJSON(data);
    if (messages && messages.length > 0) {
      console.log(`[3] Extraction method used: Claude Script JSON`);
      return { success: true, messages };
    }
  }

  // Strategy 2: Dynamic Render Browser automation fallback
  const browserMessages = await browserFallbackExtract(shareUrl, "claude");
  if (browserMessages && Array.isArray(browserMessages) && browserMessages.length > 0) {
    return { success: true, messages: browserMessages };
  }

  // Fallback Strategy 3: HTML Scrape fallback
  const fallbackMessages = fallbackHtmlScrape(html);
  if (fallbackMessages.length > 0) {
    console.log(`[3] Extraction method used: Claude HTML Scrape Fallback`);
    return { success: true, messages: fallbackMessages };
  }

  return { success: false, messages: [] };
}
