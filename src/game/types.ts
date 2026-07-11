// Domain types for React Jeopardy.

/** Which of the six source areas a clue is grounded in. */
export type Source = "learn" | "reference" | "community" | "blog" | "devto" | "reddit";

export interface Clue {
  /** Dollar value; also the difficulty tier (200 easiest, 1000 hardest). */
  value: number;
  /** The Jeopardy "answer": a statement shown to the player. */
  prompt: string;
  /** The correct response, phrased as a question ("What is ...?"). */
  response: string;
  /** Source area this clue is derived from. */
  source: Source;
}

export interface Category {
  name: string;
  clues: Clue[];
}

export type Board = Category[];

/** A coordinate into the board: category index + clue index. */
export interface ClueRef {
  c: number;
  q: number;
}

export interface Player {
  name: string;
  score: number;
}

/** setup = choosing player count; playing = the board is live. */
export type Phase = "setup" | "playing";

export interface GameState {
  phase: Phase;
  /** 1 to 4 players; empty during setup. */
  players: Player[];
  /** Index into players of whose turn it is. */
  currentPlayer: number;
  /** Currently open clue, or null when the board is showing. */
  selected: ClueRef | null;
  /** Whether the open clue's response has been revealed. */
  revealed: boolean;
  /** Keys ("c-q") of clues already answered/closed. */
  answered: string[];
}

export type Action =
  | { type: "start"; players: number }
  | { type: "select"; c: number; q: number }
  | { type: "reveal" }
  | { type: "answer"; correct: boolean }
  | { type: "close" }
  | { type: "reset" };
