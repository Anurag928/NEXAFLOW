import { ExtractorResult, extractJsonFromHtml, findMessagesInAnyJSON, fallbackHtmlScrape } from "./helper";
import { browserFallbackExtract } from "./browserFallback";

export async function extractGemini(shareUrl: string, html: string): Promise<ExtractorResult> {
  // Strategy 1: Check embedded script data in Google / Gemini share links
  // Gemini data is typically boot-strapped in init data callbacks
  const jsonObjects = extractJsonFromHtml(html);
  
  for (const data of jsonObjects) {
    const messages = findMessagesInAnyJSON(data);
    if (messages && messages.length > 0) {
      console.log(`[3] Extraction method used: Gemini Script JSON`);
      return { success: true, messages };
    }
  }

  // Strategy 2: Look for specific Gemini data arrays inside script callbacks
  // Gemini scripts often look like window.WMCa = [...] or AF_initDataCallback({key: 'ds:1', data: [...]})
  // We can search for the raw text matching double-serialized arrays
  const matches = html.match(/AF_initDataCallback\s*\(\s*\{[\s\S]*?data:\s*([\s\S]*?)\}\s*\)\s*;/g);
  if (matches) {
    for (const matchText of matches) {
      const dataMatch = matchText.match(/data:\s*([\s\S]*?)(?:\}\s*\)\s*;)/);
      if (dataMatch && dataMatch[1]) {
        try {
          const parsed = JSON.parse(dataMatch[1].trim());
          const messages = findMessagesInAnyJSON(parsed);
          if (messages && messages.length > 0) {
            console.log(`[3] Extraction method used: Gemini callback JSON`);
            return { success: true, messages };
          }
        } catch (e) {
          // Ignore
        }
      }
    }
  }

  // Strategy 3: Dynamic Render Browser automation fallback
  const browserMessages = await browserFallbackExtract(shareUrl, "gemini");
  if (browserMessages && Array.isArray(browserMessages) && browserMessages.length > 0) {
    return { success: true, messages: browserMessages };
  }

  // Fallback Strategy 4: HTML Scrape fallback
  const fallbackMessages = fallbackHtmlScrape(html);
  if (fallbackMessages.length > 0) {
    console.log(`[3] Extraction method used: Gemini HTML Scrape Fallback`);
    return { success: true, messages: fallbackMessages };
  }

  return { success: false, messages: [] };
}
