import { describe, expect, it } from "vitest";
import { aggregateInterests, recencyWeight } from "../src/core/interests";
import type { NormalizedHistoryEvent } from "../src/types";
describe("interest model", () => {
  it("applies exponential recency decay", () => { const now = 1_000_000_000; expect(recencyWeight(now, 7, now)).toBe(1); expect(recencyWeight(now - 7 * 86_400_000, 7, now)).toBeCloseTo(Math.exp(-1)); });
  it("aggregates topic evidence", () => { const now = Date.now(); const events: NormalizedHistoryEvent[] = [{ id: "1", timestamp: now, domain: "github.com", sourceType: "documentation", topics: [{ topic: "software_engineering", score: .9 }], visitWeight: .55 }]; const result = aggregateInterests(events, now); expect(result[0].label).toBe("Software Engineering"); expect(result[0].evidenceCount).toBe(1); });
});
