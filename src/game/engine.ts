import type { Action, Board, GameState } from "./types";
import { BOARD } from "./questions";

export const clueKey = (c: number, q: number): string => `${c}-${q}`;

export function totalClues(board: Board = BOARD): number {
  return board.reduce((n, cat) => n + cat.clues.length, 0);
}

export function createInitialState(): GameState {
  return { score: 0, selected: null, revealed: false, answered: [] };
}

export function isAnswered(state: GameState, c: number, q: number): boolean {
  return state.answered.includes(clueKey(c, q));
}

export function isComplete(state: GameState, board: Board = BOARD): boolean {
  return state.answered.length >= totalClues(board);
}

/** Pure reducer. `board` is injected for testability; defaults to the shipped BOARD. */
export function reducer(state: GameState, action: Action, board: Board = BOARD): GameState {
  switch (action.type) {
    case "select": {
      // Ignore if a clue is already open or this one was answered.
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
      if (!state.selected) return state;
      const { c, q } = state.selected;
      const value = board[c].clues[q].value;
      return {
        ...state,
        score: state.score + (action.correct ? value : -value),
        answered: [...state.answered, clueKey(c, q)],
        selected: null,
        revealed: false,
      };
    }
    case "close": {
      // Dismiss without scoring, but the clue counts as used.
      if (!state.selected) return state;
      const { c, q } = state.selected;
      return {
        ...state,
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
