import { describe, it, expect } from "vitest";
import {
  createInitialState,
  reducer,
  isAnswered,
  isComplete,
  clueKey,
  totalClues,
} from "../engine";
import type { Board } from "../types";

const testBoard: Board = [
  {
    name: "Cat A",
    clues: [
      { value: 200, prompt: "p1", response: "What is r1?", source: "learn" },
      { value: 400, prompt: "p2", response: "What is r2?", source: "reference" },
    ],
  },
  {
    name: "Cat B",
    clues: [{ value: 600, prompt: "p3", response: "What is r3?", source: "reddit" }],
  },
];

describe("createInitialState", () => {
  it("starts at zero with nothing selected or answered", () => {
    const s = createInitialState();
    expect(s.score).toBe(0);
    expect(s.selected).toBeNull();
    expect(s.answered).toEqual([]);
    expect(s.revealed).toBe(false);
  });
});

describe("select", () => {
  it("opens a clue", () => {
    const s = reducer(createInitialState(), { type: "select", c: 0, q: 0 }, testBoard);
    expect(s.selected).toEqual({ c: 0, q: 0 });
    expect(s.revealed).toBe(false);
  });

  it("ignores a second select while a clue is open", () => {
    let s = reducer(createInitialState(), { type: "select", c: 0, q: 0 }, testBoard);
    s = reducer(s, { type: "select", c: 0, q: 1 }, testBoard);
    expect(s.selected).toEqual({ c: 0, q: 0 });
  });

  it("ignores selecting an already-answered clue", () => {
    let s = reducer(createInitialState(), { type: "select", c: 0, q: 0 }, testBoard);
    s = reducer(s, { type: "answer", correct: true }, testBoard);
    s = reducer(s, { type: "select", c: 0, q: 0 }, testBoard);
    expect(s.selected).toBeNull();
  });

  it("ignores out-of-range coordinates", () => {
    const s = reducer(createInitialState(), { type: "select", c: 9, q: 9 }, testBoard);
    expect(s.selected).toBeNull();
  });
});

describe("reveal", () => {
  it("reveals the open clue's response", () => {
    let s = reducer(createInitialState(), { type: "select", c: 0, q: 0 }, testBoard);
    s = reducer(s, { type: "reveal" }, testBoard);
    expect(s.revealed).toBe(true);
  });

  it("is a no-op with nothing open", () => {
    const s = reducer(createInitialState(), { type: "reveal" }, testBoard);
    expect(s.revealed).toBe(false);
  });
});

describe("answer", () => {
  it("adds the value on a correct answer and closes the clue", () => {
    let s = reducer(createInitialState(), { type: "select", c: 0, q: 1 }, testBoard);
    s = reducer(s, { type: "answer", correct: true }, testBoard);
    expect(s.score).toBe(400);
    expect(s.selected).toBeNull();
    expect(isAnswered(s, 0, 1)).toBe(true);
  });

  it("subtracts the value on a wrong answer", () => {
    let s = reducer(createInitialState(), { type: "select", c: 0, q: 1 }, testBoard);
    s = reducer(s, { type: "answer", correct: false }, testBoard);
    expect(s.score).toBe(-400);
    expect(isAnswered(s, 0, 1)).toBe(true);
  });
});

describe("close", () => {
  it("marks the clue used without changing the score", () => {
    let s = reducer(createInitialState(), { type: "select", c: 0, q: 0 }, testBoard);
    s = reducer(s, { type: "close" }, testBoard);
    expect(s.score).toBe(0);
    expect(isAnswered(s, 0, 0)).toBe(true);
    expect(s.selected).toBeNull();
  });
});

describe("completion + reset", () => {
  it("totalClues counts every clue on the board", () => {
    expect(totalClues(testBoard)).toBe(3);
  });

  it("isComplete once all clues are answered", () => {
    let s = createInitialState();
    const coords = [
      { c: 0, q: 0 },
      { c: 0, q: 1 },
      { c: 1, q: 0 },
    ];
    for (const { c, q } of coords) {
      s = reducer(s, { type: "select", c, q }, testBoard);
      s = reducer(s, { type: "answer", correct: true }, testBoard);
    }
    expect(isComplete(s, testBoard)).toBe(true);
  });

  it("reset returns to the initial state", () => {
    let s = reducer(createInitialState(), { type: "select", c: 0, q: 0 }, testBoard);
    s = reducer(s, { type: "answer", correct: true }, testBoard);
    s = reducer(s, { type: "reset" }, testBoard);
    expect(s).toEqual(createInitialState());
  });

  it("clueKey formats coordinates", () => {
    expect(clueKey(2, 3)).toBe("2-3");
  });
});
