import type { Action, Board, GameState, Player } from "./types";
import { BOARD } from "./questions";

export const MIN_PLAYERS = 1;
export const MAX_PLAYERS = 4;

export const clueKey = (c: number, q: number): string => `${c}-${q}`;

export function totalClues(board: Board = BOARD): number {
  return board.reduce((n, cat) => n + cat.clues.length, 0);
}

export function createInitialState(): GameState {
  return {
    phase: "setup",
    players: [],
    currentPlayer: 0,
    selected: null,
    revealed: false,
    answered: [],
  };
}

export function isAnswered(state: GameState, c: number, q: number): boolean {
  return state.answered.includes(clueKey(c, q));
}

export function isComplete(state: GameState, board: Board = BOARD): boolean {
  return state.phase === "playing" && state.answered.length >= totalClues(board);
}

/** Players with the highest score (ties return multiple). Empty until playing. */
export function leaders(state: GameState): Player[] {
  if (state.players.length === 0) return [];
  const top = Math.max(...state.players.map((p) => p.score));
  return state.players.filter((p) => p.score === top);
}

/** All players ranked by score, highest first (stable for equal scores). */
export function standings(state: GameState): Player[] {
  return [...state.players].sort((a, b) => b.score - a.score);
}

function clampPlayers(n: number): number {
  if (Number.isNaN(n)) return MIN_PLAYERS;
  return Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, Math.floor(n)));
}

/** Pure reducer. `board` is injected for testability; defaults to the shipped BOARD. */
export function reducer(state: GameState, action: Action, board: Board = BOARD): GameState {
  switch (action.type) {
    case "start": {
      const n = clampPlayers(action.players);
      const players: Player[] = Array.from({ length: n }, (_, i) => ({
        name: `Player ${i + 1}`,
        score: 0,
      }));
      return { ...createInitialState(), phase: "playing", players };
    }
    case "select": {
      if (state.phase !== "playing") return state;
      if (state.selected) return state;
      if (isAnswered(state, action.c, action.q)) return state;
      const cat = board[action.c];
      if (!cat || !cat.clues[action.q]) return state;
      return { ...state, selected: { c: action.c, q: action.q }, revealed: false };
    }
    case "reveal": {
      if (!state.selected) return state;
      return { ...state, revealed: true };
    }
    case "answer": {
      if (!state.selected || state.players.length === 0) return state;
      const { c, q } = state.selected;
      const value = board[c].clues[q].value;
      const players = state.players.map((p, i) =>
        i === state.currentPlayer
          ? { ...p, score: p.score + (action.correct ? value : -value) }
          : p,
      );
      // Correct: keep control. Wrong: pass to the next player.
      const currentPlayer = action.correct
        ? state.currentPlayer
        : (state.currentPlayer + 1) % state.players.length;
      return {
        ...state,
        players,
        currentPlayer,
        answered: [...state.answered, clueKey(c, q)],
        selected: null,
        revealed: false,
      };
    }
    case "close": {
      if (!state.selected) return state;
      const { c, q } = state.selected;
      // Skip: nobody scores; control passes to the next player.
      const currentPlayer =
        state.players.length > 0
          ? (state.currentPlayer + 1) % state.players.length
          : state.currentPlayer;
      return {
        ...state,
        currentPlayer,
        answered: [...state.answered, clueKey(c, q)],
        selected: null,
        revealed: false,
      };
    }
    case "reset":
      return createInitialState();
    default:
      return state;
  }
}
