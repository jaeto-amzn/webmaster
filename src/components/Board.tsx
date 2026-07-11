import type { Dispatch } from "react";
import type { Action, Board as BoardType, GameState } from "../game/types";
import { isAnswered } from "../game/engine";

interface Props {
  board: BoardType;
  state: GameState;
  dispatch: Dispatch<Action>;
}

export function Board({ board, state, dispatch }: Props) {
  const rows = board[0]?.clues.length ?? 0;
  const locked = state.selected !== null;

  return (
    <div
      className="board"
      style={{ gridTemplateColumns: `repeat(${board.length}, minmax(0, 1fr))` }}
    >
      {board.map((cat) => (
        <div key={cat.name} className="category">
          {cat.name}
        </div>
      ))}

      {Array.from({ length: rows }, (_, q) =>
        board.map((cat, c) => {
          const used = isAnswered(state, c, q);
          return (
            <button
              key={`${c}-${q}`}
              className={`cell${used ? " used" : ""}`}
              disabled={used || locked}
              onClick={() => dispatch({ type: "select", c, q })}
              aria-label={used ? "Answered" : `${cat.name}, $${cat.clues[q].value}`}
            >
              {used ? "" : `$${cat.clues[q].value}`}
            </button>
          );
        }),
      )}
    </div>
  );
}
