import { describe, expect, it } from "vitest";
import { classifyTopics } from "../src/core/classify";
describe("taxonomy", () => {
  it("maps known domains deterministically", () => expect(classifyTopics("github.com", [], "")).toContainEqual({ topic: "software_engineering", score: 0.9 }));
  it("classifies unknown domains from safe text", () => expect(classifyTopics("example.com", ["machine-learning"], "AI tutorial").map((x) => x.topic)).toContain("artificial_intelligence"));
});
