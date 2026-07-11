import { describe, it, expect } from "vitest";
import { BOARD, VALUES } from "../questions";
import type { Source } from "../types";

const SOURCES: Source[] = ["learn", "reference", "community", "blog", "devto", "reddit"];

describe("BOARD dataset", () => {
  it("has exactly 6 categories", () => {
    expect(BOARD).toHaveLength(6);
  });

  it("has unique category names", () => {
    const names = BOARD.map((c) => c.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("gives every category 5 clues at the standard values in ascending order", () => {
    for (const cat of BOARD) {
      expect(cat.clues).toHaveLength(5);
      expect(cat.clues.map((c) => c.value)).toEqual([...VALUES]);
    }
  });

  it("has non-empty prompts and question-form responses", () => {
    for (const cat of BOARD) {
      for (const clue of cat.clues) {
        expect(clue.prompt.trim().length).toBeGreaterThan(0);
        expect(clue.response.trim().length).toBeGreaterThan(0);
        // Jeopardy responses must be phrased as a question.
        expect(clue.response.trim().endsWith("?")).toBe(true);
        expect(/^(what|who|where|when|why|how)\b/i.test(clue.response.trim())).toBe(true);
      }
    }
  });

  it("tags every clue with a valid source", () => {
    for (const cat of BOARD) {
      for (const clue of cat.clues) {
        expect(SOURCES).toContain(clue.source);
      }
    }
  });

  it("draws from every one of the six sources at least once", () => {
    const used = new Set(BOARD.flatMap((c) => c.clues.map((cl) => cl.source)));
    for (const s of SOURCES) expect(used).toContain(s);
  });
});
