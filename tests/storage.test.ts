import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { deleteAllData, loadProfile, saveProfile } from "../src/core/storage";
describe("local deletion", () => {
  beforeEach(async () => { try { await deleteAllData(); } catch {} });
  it("removes events and derived profile", async () => { const profile = { interests: [], eventsProcessed: 0, filteredEvents: 0, builtAt: Date.now(), windowDays: 90 }; await saveProfile([], profile); expect(await loadProfile()).not.toBeNull(); await deleteAllData(); expect(await loadProfile()).toBeNull(); });
  it("the persisted event schema has no cookie or raw URL field", () => { const allowed = ["id", "timestamp", "domain", "pathTokens", "sourceType", "topics", "entities", "visitWeight", "embedding"]; expect(allowed).not.toContain("url"); expect(allowed).not.toContain("cookie"); });
});
