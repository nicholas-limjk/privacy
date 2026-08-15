import type { NormalizedHistoryEvent, RawHistoryEvent } from "../types";
import { classifySource, classifyTopics } from "./classify";
import { sanitizeUrl, sensitiveAction } from "./privacy";

const weights = { search: 1, product: 0.7, video: 0.55, documentation: 0.55, article: 0.5, social: 0.3, other: 0.2 } as const;

export async function normalizeHistoryEvent(raw: RawHistoryEvent): Promise<NormalizedHistoryEvent | null> {
  const action = sensitiveAction(raw.url);
  if (action === "drop") return null;
  const safe = sanitizeUrl(raw.url, action === "domain_only");
  if (!safe) return null;
  const sourceType = classifySource(safe.domain, safe.pathTokens, raw.title);
  const topics = classifyTopics(safe.domain, safe.pathTokens, raw.title);
  if (!topics.length) return null;
  const timestamp = raw.lastVisitTime ?? Date.now();
  const stableText = `${safe.domain}|${safe.pathTokens.join("/")}|${timestamp}`;
  const bytes = new TextEncoder().encode(stableText);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  const id = [...new Uint8Array(hash)].slice(0, 12).map((v) => v.toString(16).padStart(2, "0")).join("");
  return { id, timestamp, domain: safe.domain, pathTokens: safe.pathTokens.length ? safe.pathTokens : undefined, sourceType, topics, visitWeight: weights[sourceType] };
}
