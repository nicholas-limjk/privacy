import type { Interest, NormalizedHistoryEvent } from "../types";

export function recencyWeight(timestamp: number, halfLifeDays: number, now = Date.now()): number {
  const ageDays = Math.max(0, now - timestamp) / 86_400_000;
  return Math.exp(-ageDays / halfLifeDays);
}

export function aggregateInterests(events: NormalizedHistoryEvent[], now = Date.now()): Interest[] {
  const grouped = new Map<string, { short: number; long: number; first: number; last: number; count: number; search: number }>();
  const topicFrequency = new Map<string, number>();
  events.forEach((event) => event.topics.forEach(({ topic }) => topicFrequency.set(topic, (topicFrequency.get(topic) ?? 0) + 1)));
  for (const event of events) for (const { topic, score } of event.topics) {
    const repetition = 1 + Math.log1p((topicFrequency.get(topic) ?? 1) - 1) * 0.12;
    const base = score * event.visitWeight * repetition;
    const current = grouped.get(topic) ?? { short: 0, long: 0, first: event.timestamp, last: event.timestamp, count: 0, search: 0 };
    current.short += base * recencyWeight(event.timestamp, 7, now);
    current.long += base * recencyWeight(event.timestamp, 45, now);
    current.first = Math.min(current.first, event.timestamp); current.last = Math.max(current.last, event.timestamp); current.count++;
    if (event.sourceType === "search") current.search += base;
    grouped.set(topic, current);
  }
  const maxShort = Math.max(1, ...[...grouped.values()].map((v) => v.short));
  const maxLong = Math.max(1, ...[...grouped.values()].map((v) => v.long));
  return [...grouped].map(([topic, v]) => {
    const shortTermScore = v.short / maxShort, longTermScore = v.long / maxLong;
    return { id: topic, label: topic.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), score: shortTermScore * 0.4 + longTermScore * 0.6,
      shortTermScore, longTermScore, firstSeen: v.first, lastSeen: v.last, evidenceCount: v.count,
      sourceWeights: { history: v.long, search: v.search, exposure: 0, interaction: 0 },
      emerging: shortTermScore >= 0.6 && shortTermScore >= longTermScore * 1.75 };
  }).sort((a, b) => b.score - a.score);
}

export function interestBucket(interest: Interest): string {
  if (interest.emerging) return "Emerging";
  if (interest.score >= 0.8) return "Very high";
  if (interest.score >= 0.6) return "High";
  if (interest.score >= 0.35) return "Medium";
  return "Low";
}
