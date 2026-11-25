import { describe, expect, it } from "vitest";

import { amountInWords } from "../src/lib/amount-in-words";

describe("amountInWords", () => {
  it("converts small amounts", () => {
    expect(amountInWords(1000)).toBe("Mille francs CFA");
    expect(amountInWords(1)).toBe("Un francs CFA");
  });

  it("converts larger amounts", () => {
    expect(amountInWords(25000)).toContain("Vingt-cinq");
  });

  it("rejects negative values", () => {
    expect(() => amountInWords(-5)).toThrow();
  });
});
