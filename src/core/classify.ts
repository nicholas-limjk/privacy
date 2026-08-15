import { domainTaxonomy, keywordTopics } from "../data";
import type { SourceType, TopicScore } from "../types";

export function classifySource(domain: string, pathTokens: string[], title = ""): SourceType {
  const text = `${domain} ${pathTokens.join(" ")} ${title}`.toLowerCase();
  if (/google\.|bing\.|duckduckgo\.|\/search|search results/.test(text)) return "search";
  if (/youtube|vimeo|video|watch/.test(text)) return "video";
  if (/github|stackoverflow|docs|developer|documentation|reference/.test(text)) return "documentation";
  if (/product|shop|store|amazon|buy|cart/.test(text)) return "product";
  if (/reddit|twitter|x\.com|facebook|instagram|linkedin/.test(text)) return "social";
  if (/article|news|blog|medium/.test(text)) return "article";
  return "other";
}

export function classifyTopics(domain: string, pathTokens: string[], title = ""): TopicScore[] {
  const known = Object.entries(domainTaxonomy).find(([key]) => domain === key || domain.endsWith(`.${key}`))?.[1] ?? [];
  const words = `${domain.replace(/\.[a-z]+$/, "")} ${pathTokens.join(" ")} ${title}`.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const scores = new Map<string, number>();
  known.forEach((topic) => scores.set(topic, 0.9));
  for (const [topic, keywords] of Object.entries(keywordTopics)) {
    const hits = keywords.filter((keyword) => words.includes(keyword)).length;
    if (hits) scores.set(topic, Math.max(scores.get(topic) ?? 0, Math.min(0.85, 0.45 + hits * 0.12)));
  }
  return [...scores].map(([topic, score]) => ({ topic, score })).sort((a, b) => b.score - a.score).slice(0, 4);
}
