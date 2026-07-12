import { describe, it, expect } from "vitest";
import {
  createInitialState,
  reducer,
  isAnswered,
  isComplete,
  clueKey,
  totalClues,
  leaders,
  standings,
  MAX_PLAYERS,
} from "../engine";
import type { Board, GameState } from "../types";

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

/** Start a 2-player game on the test board. */
function twoPlayer(): GameState {
  return reducer(createInitialState(), { type: "start", players: 2 }, testBoard);
}

describe("setup + start", () => {
  it("begins in the setup phase with no players", () => {
    const s = createInitialState();
    expect(s.phase).toBe("setup");
    expect(s.players).toEqual([]);
  });

  it("start creates N named players at zero and enters play", () => {
    const s = twoPlayer();
    expect(s.phase).toBe("playing");
    expect(s.players).toEqual([
      { name: "Player 1", score: 0 },
      { name: "Player 2", score: 0 },
    ]);
    expect(s.currentPlayer).toBe(0);
  });

  it("clamps the player count to 1..MAX_PLAYERS", () => {
    expect(reducer(createInitialState(), { type: "start", players: 0 }).players).toHaveLength(1);
    expect(
      reducer(createInitialState(), { type: "start", players: 99 }).players,
    ).toHaveLength(MAX_PLAYERS);
  });

  it("ignores select while still in setup", () => {
    const s = reducer(createInitialState(), { type: "select", c: 0, q: 0 }, testBoard);
    expect(s.selected).toBeNull();
  });
});

describe("turn-based scoring", () => {
  it("a correct answer scores the current player and keeps their turn", () => {
    let s = twoPlayer();
    s = reducer(s, { type: "select", c: 0, q: 1 }, testBoard); // $400
    s = reducer(s, { type: "answer", correct: true }, testBoard);
    expect(s.players[0].score).toBe(400);
    expect(s.players[1].score).toBe(0);
    expect(s.currentPlayer).toBe(0);
    expect(isAnswered(s, 0, 1)).toBe(true);
  });

  it("a wrong answer deducts and passes the turn", () => {
    let s = twoPlayer();
    s = reducer(s, { type: "select", c: 0, q: 1 }, testBoard);
    s = reducer(s, { type: "answer", correct: false }, testBoard);
    expect(s.players[0].score).toBe(-400);
    expect(s.currentPlayer).toBe(1);
  });

  it("skipping passes the turn without scoring", () => {
    let s = twoPlayer();
    s = reducer(s, { type: "select", c: 0, q: 0 }, testBoard);
    s = reducer(s, { type: "close" }, testBoard);
    expect(s.players.every((p) => p.score === 0)).toBe(true);
    expect(s.currentPlayer).toBe(1);
    expect(isAnswered(s, 0, 0)).toBe(true);
  });

  it("turn wraps around the player list", () => {
    let s = twoPlayer();
    s = reducer(s, { type: "select", c: 0, q: 0 }, testBoard);
    s = reducer(s, { type: "answer", correct: false }, testBoard); // 0 -> 1
    s = reducer(s, { type: "select", c: 0, q: 1 }, testBoard);
    s = reducer(s, { type: "answer", correct: false }, testBoard); // 1 -> 0
    expect(s.currentPlayer).toBe(0);
  });

  it("solo play keeps the single player in control", () => {
    let s = reducer(createInitialState(), { type: "start", players: 1 }, testBoard);
    s = reducer(s, { type: "select", c: 0, q: 0 }, testBoard);
    s = reducer(s, { type: "answer", correct: false }, testBoard);
    expect(s.currentPlayer).toBe(0);
    expect(s.players[0].score).toBe(-200);
  });
});

describe("completion, winners, reset", () => {
  it("totalClues counts every clue", () => {
    expect(totalClues(testBoard)).toBe(3);
  });

  it("is not complete during setup", () => {
    expect(isComplete(createInitialState(), testBoard)).toBe(false);
  });

  it("isComplete once all clues are used, and leaders reports the winner", () => {
    let s = twoPlayer();
    // P1 gets $200 (correct, keeps turn), then $400 (correct), then skip last.
    s = reducer(s, { type: "select", c: 0, q: 0 }, testBoard);
    s = reducer(s, { type: "answer", correct: true }, testBoard);
    s = reducer(s, { type: "select", c: 0, q: 1 }, testBoard);
    s = reducer(s, { type: "answer", correct: true }, testBoard);
    s = reducer(s, { type: "select", c: 1, q: 0 }, testBoard);
    s = reducer(s, { type: "close" }, testBoard);
    expect(isComplete(s, testBoard)).toBe(true);
    const top = leaders(s);
    expect(top).toHaveLength(1);
    expect(top[0].name).toBe("Player 1");
    expect(top[0].score).toBe(600);
  });

  it("leaders returns everyone on a tie", () => {
    const s = twoPlayer(); // both at 0
    expect(leaders(s)).toHaveLength(2);
  });

  it("standings ranks players by score, highest first", () => {
    let s = twoPlayer();
    s = reducer(s, { type: "select", c: 0, q: 0 }, testBoard);
    s = reducer(s, { type: "answer", correct: false }, testBoard); // P1: -200, turn -> P2
    const ranked = standings(s);
    expect(ranked.map((p) => p.name)).toEqual(["Player 2", "Player 1"]);
    expect(ranked[0].score).toBe(0);
    expect(ranked[1].score).toBe(-200);
  });

  it("reset returns to setup", () => {
    let s = twoPlayer();
    s = reducer(s, { type: "reset" }, testBoard);
    expect(s).toEqual(createInitialState());
  });

  it("clueKey formats coordinates", () => {
    expect(clueKey(2, 3)).toBe("2-3");
  });
});
