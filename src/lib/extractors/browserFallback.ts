import { ModelId } from "@/components/ModelSelector";
import { ExtractorMessage } from "./helper";

export type BrowserFallbackResult = ExtractorMessage[] | {
  success: false;
  method: "no-browser-tools";
  message: string;
};

/**
 * Strategy 3 fallback: attempts to use Playwright or Puppeteer dynamically
 * to extract rendered HTML message nodes if browser automation packages are installed.
 * Uses safe dynamic imports to prevent top-level require() build failures.
 */
export async function browserFallbackExtract(
  shareUrl: string,
  sourceModel: ModelId
): Promise<BrowserFallbackResult> {
  let chromium: any = null;
  let puppeteer: any = null;

  try {
    const playwrightName = "playwright";
    const playwright = await import(playwrightName);
    chromium = playwright.chromium;
  } catch (e) {
    console.log("Playwright not available");
  }

  try {
    const puppeteerName = "puppeteer";
    puppeteer = await import(puppeteerName);
  } catch (e) {
    console.log("Puppeteer not available");
  }

  // 1. Playwright Fallback
  if (chromium) {
    try {
      console.log(`[3] Extraction method used: Playwright fallback`);
      const browser = await chromium.launch({ headless: true });
      const context = await browser.newContext({
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      });
      const page = await context.newPage();
      await page.goto(shareUrl, { waitUntil: "networkidle", timeout: 12000 });

      const messages: ExtractorMessage[] = [];
      
      if (sourceModel === "chatgpt") {
        const nodes = await page.$$("div[data-message-author-role]");
        for (const node of nodes) {
          const role = await node.getAttribute("data-message-author-role");
          const text = await node.innerText();
          if (role === "user" || role === "assistant") {
            messages.push({ role: role as "user" | "assistant", content: text.trim() });
          }
        }
      } else {
        // Selector heuristics for other platforms (Gemini, Claude)
        const blocks = await page.$$("div[class*='message'], div[class*='chat'], article, p");
        for (const block of blocks) {
          const text = await block.innerText();
          const textClean = text.trim();
          if (textClean.length > 0) {
            if (textClean.toLowerCase().startsWith("user:") || textClean.toLowerCase().startsWith("human:")) {
              messages.push({ role: "user", content: textClean.replace(/^(user|human):\s*/i, "") });
            } else if (textClean.toLowerCase().startsWith("assistant:") || textClean.toLowerCase().startsWith("claude:") || textClean.toLowerCase().startsWith("gemini:")) {
              messages.push({ role: "assistant", content: textClean.replace(/^(assistant|claude|gemini):\s*/i, "") });
            }
          }
        }
      }

      await browser.close();
      if (messages.length > 0) {
        return messages;
      }
    } catch (e) {
      console.log("Playwright run failed:", e);
    }
  }

  // 2. Puppeteer Fallback
  if (puppeteer) {
    try {
      console.log(`[3] Extraction method used: Puppeteer fallback`);
      const browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();
      await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
      await page.goto(shareUrl, { waitUntil: "networkidle2", timeout: 12000 });

      const messages: ExtractorMessage[] = await page.evaluate(() => {
        const found: any[] = [];
        const chatgptNodes = document.querySelectorAll("div[data-message-author-role]");
        if (chatgptNodes.length > 0) {
          chatgptNodes.forEach(node => {
            const role = node.getAttribute("data-message-author-role");
            const text = (node as HTMLElement).innerText || "";
            if (role === "user" || role === "assistant") {
              found.push({ role, content: text.trim() });
            }
          });
        }
        return found;
      });

      await browser.close();
      if (messages.length > 0) {
        return messages;
      }
    } catch (e) {
      console.log("Puppeteer run failed:", e);
    }
  }

  return {
    success: false,
    method: "no-browser-tools",
    message: "Browser extraction unavailable in this environment"
  };
}
