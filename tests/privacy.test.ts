import "fake-indexeddb/auto";
import { describe, expect, it } from "vitest";
import { sanitizeUrl, sensitiveAction } from "../src/core/privacy";
import { normalizeHistoryEvent } from "../src/core/normalize";

describe("privacy pipeline", () => {
  it("discards query strings, fragments, credentials and opaque path identifiers", () => {
    expect(sanitizeUrl("https://user:pass@example.com/product/stroller/abcdef0123456789?session=secret#reviews")).toEqual({ domain: "example.com", pathTokens: ["product", "stroller"] });
  });
  it("drops sensitive domains before normalization", async () => {
    expect(sensitiveAction("https://mail.google.com/mail/u/0/#inbox")).toBe("drop");
    expect(await normalizeHistoryEvent({ url: "https://mail.google.com/mail/u/0/#inbox", title: "Private mail" })).toBeNull();
  });
  it("never persists a raw URL shape", async () => {
    const event = await normalizeHistoryEvent({ url: "https://github.com/openai/project?token=secret", title: "Code" });
    expect(event).not.toHaveProperty("url"); expect(JSON.stringify(event)).not.toContain("secret");
  });
});
