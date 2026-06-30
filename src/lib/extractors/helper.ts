export interface ExtractorMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ExtractorResult {
  success: boolean;
  title?: string;
  messages: ExtractorMessage[];
}

/**
 * Traverses ChatGPT mapping tree to reconstruct conversation chronologically.
 */
export function traverseChatGPTMapping(mapping: any, currentNodeId?: string): ExtractorMessage[] {
  const messages: ExtractorMessage[] = [];
  if (!mapping) return messages;

  // Find the leaf node (a node whose ID is not a parent of any other node)
  let leafId = currentNodeId;
  if (!leafId) {
    const parentIds = new Set<string>();
    for (const key in mapping) {
      if (mapping[key].parent) {
        parentIds.add(mapping[key].parent);
      }
    }
    for (const key in mapping) {
      if (!parentIds.has(key) && mapping[key].message) {
        leafId = key;
        break;
      }
    }
  }

  // Fallback: if no leafId, just take the last key
  if (!leafId) {
    const keys = Object.keys(mapping);
    leafId = keys[keys.length - 1];
  }

  let curr = mapping[leafId];
  const visited = new Set<string>(); // Prevent infinite loops

  while (curr) {
    const msgId = curr.id || curr.message?.id;
    if (msgId) {
      if (visited.has(msgId)) break;
      visited.add(msgId);
    }

    const message = curr.message;
    if (message && message.content) {
      const role = message.author?.role;
      if (role === "user" || role === "assistant") {
        let contentText = "";
        if (Array.isArray(message.content.parts)) {
          contentText = message.content.parts
            .map((p: any) => (typeof p === "string" ? p : typeof p === "object" && p ? p.text || JSON.stringify(p) : ""))
            .filter(Boolean)
            .join("\n");
        } else if (typeof message.content === "string") {
          contentText = message.content;
        } else if (typeof message.content.text === "string") {
          contentText = message.content.text;
        }
        
        if (contentText.trim().length > 0) {
          messages.push({
            role: role === "user" ? "user" : "assistant",
            content: contentText.trim(),
          });
        }
      }
    }

    const parentId = curr.parent;
    curr = parentId ? mapping[parentId] : null;
  }

  return messages.reverse();
}

/**
 * Recursively searches any JSON object for message arrays or structures
 * that look like a list of conversation turns.
 */
export function findMessagesInAnyJSON(data: any): ExtractorMessage[] | null {
  if (!data) return null;

  // If it's an array, check if it contains message-like objects
  if (Array.isArray(data)) {
    const candidateMessages: ExtractorMessage[] = [];
    for (const item of data) {
      if (item && typeof item === "object") {
        const role = item.role || item.sender || item.author?.role || item.type;
        let content = "";
        
        if (item.content && Array.isArray(item.content.parts)) {
          content = item.content.parts
            .map((p: any) => (typeof p === "string" ? p : typeof p === "object" && p ? p.text || JSON.stringify(p) : ""))
            .filter(Boolean)
            .join("\n");
        } else {
          content = item.content || item.text || item.body || "";
        }

        if (typeof role === "string" && typeof content === "string" && content.trim().length > 0) {
          const cleanRole = role.toLowerCase();
          if (cleanRole === "user" || cleanRole === "human" || cleanRole === "me") {
            candidateMessages.push({ role: "user", content: content.trim() });
          } else if (cleanRole === "assistant" || cleanRole === "bot" || cleanRole === "ai" || cleanRole === "model") {
            candidateMessages.push({ role: "assistant", content: content.trim() });
          }
        }
      }
    }

    if (candidateMessages.length > 0) {
      return candidateMessages;
    }

    // Recurse into array elements
    for (const item of data) {
      const res = findMessagesInAnyJSON(item);
      if (res && res.length > 0) return res;
    }
  } else if (typeof data === "object") {
    // Check if this object contains a ChatGPT-like mapping field
    if (data.mapping && typeof data.mapping === "object") {
      const traversed = traverseChatGPTMapping(data.mapping, data.current_node);
      if (traversed.length > 0) return traversed;
    }

    // Recurse into object keys
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const res = findMessagesInAnyJSON(data[key]);
        if (res && res.length > 0) return res;
      }
    }
  }
  return null;
}

/**
 * Scans a string character by character to extract valid nested JSON structures (objects or arrays).
 */
export function extractNestedJSON(str: string): any[] {
  const jsonObjects: any[] = [];
  let index = 0;
  
  while (index < str.length) {
    const char = str[index];
    if (char === '{' || char === '[') {
      const startChar = char;
      const endChar = char === '{' ? '}' : ']';
      let depth = 1;
      let i = index + 1;
      let inString = false;
      let escape = false;
      
      while (i < str.length && depth > 0) {
        const c = str[i];
        
        if (escape) {
          escape = false;
        } else if (c === '\\') {
          escape = true;
        } else if (c === '"') {
          inString = !inString;
        } else if (!inString) {
          if (c === startChar) {
            depth++;
          } else if (c === endChar) {
            depth--;
          }
        }
        i++;
      }
      
      if (depth === 0) {
        const jsonCandidate = str.substring(index, i);
        try {
          const parsed = JSON.parse(jsonCandidate);
          if (parsed && typeof parsed === "object") {
            jsonObjects.push(parsed);
          }
        } catch (e) {
          // Ignore parsing errors for non-JSON declarations
        }
      }
      index = i;
    } else {
      index++;
    }
  }
  
  return jsonObjects;
}

/**
 * Extracts all JSON-like structures from script tags in HTML.
 */
export function extractJsonFromHtml(html: string): any[] {
  const parsedObjects: any[] = [];
  if (!html) return parsedObjects;

  // Match script tags
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  
  while ((match = scriptRegex.exec(html)) !== null) {
    const scriptContent = match[1].trim();
    if (!scriptContent) continue;

    // Use our nested bracket parser to extract all JSON blocks from the script content!
    const nestedJSONs = extractNestedJSON(scriptContent);
    parsedObjects.push(...nestedJSONs);
  }

  // Also look for specific Next.js __NEXT_DATA__ block if not captured
  const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (nextDataMatch && nextDataMatch[1]) {
    try {
      const parsed = JSON.parse(nextDataMatch[1].trim());
      if (parsed) parsedObjects.push(parsed);
    } catch (e) {
      // Ignore
    }
  }

  return parsedObjects;
}

/**
 * Generically parses HTML body tags to extract messages if JSON extraction fails completely.
 * Trims headers, scripts, styles, footer, etc., keeping potential User/Assistant texts.
 */
export function fallbackHtmlScrape(html: string): ExtractorMessage[] {
  const messages: ExtractorMessage[] = [];
  if (!html) return messages;

  // Strip scripts & styles
  let cleanHtml = html.replace(/<script[\s\S]*?<\/script>/gi, "")
                      .replace(/<style[\s\S]*?<\/style>/gi, "");

  // Locate common message containers
  let cleanText = cleanHtml.replace(/<[^>]*>/g, "\n");
  const lines = cleanText.split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);

  let currentRole: "user" | "assistant" | null = null;
  let currentContent: string[] = [];

  for (const line of lines) {
    const lineLower = line.toLowerCase();
    
    // Detect role switches
    const isUserSwitch = lineLower === "user" || lineLower === "human" || lineLower.startsWith("user:") || lineLower.startsWith("human:");
    const isAssistantSwitch = lineLower === "assistant" || lineLower === "chatgpt" || lineLower === "claude" || lineLower === "gemini" || lineLower.startsWith("assistant:") || lineLower.startsWith("chatgpt:") || lineLower.startsWith("claude:") || lineLower.startsWith("gemini:");

    if (isUserSwitch || isAssistantSwitch) {
      // Save previous message
      if (currentRole && currentContent.length > 0) {
        messages.push({ role: currentRole, content: currentContent.join("\n") });
      }
      currentRole = isUserSwitch ? "user" : "assistant";
      currentContent = [];
      
      const colonIdx = line.indexOf(":");
      if (colonIdx !== -1) {
        const textAfterColon = line.substring(colonIdx + 1).trim();
        if (textAfterColon) {
          currentContent.push(textAfterColon);
        }
      }
    } else if (currentRole) {
      // Filter out footer/navigation garbage
      const isGarbage = lineLower.includes("log in") || 
                        lineLower.includes("sign up") || 
                        lineLower.includes("cookie policy") || 
                        lineLower.includes("terms of use") || 
                        lineLower.includes("privacy policy") ||
                        lineLower.includes("share conversation");
      if (!isGarbage) {
        currentContent.push(line);
      }
    }
  }

  // Add the last message
  if (currentRole && currentContent.length > 0) {
    messages.push({ role: currentRole, content: currentContent.join("\n") });
  }

  return messages;
}
