import type { Dispatch } from "react";
import type { Action, GameState } from "../game/types";
import { totalClues, leaders } from "../game/engine";

interface Props {
  state: GameState;
  complete: boolean;
  dispatch: Dispatch<Action>;
}

export function Scoreboard({ state, complete, dispatch }: Props) {
  const total = totalClues();
  const winners = complete ? leaders(state) : [];
  const tie = winners.length === state.players.length && state.players.length > 1;

  return (
    <div className="scoreboard">
      <div className="players">
        {state.players.map((p, i) => (
          <div
            key={i}
            className={`player${i === state.currentPlayer && !complete ? " current" : ""}${
              complete && winners.includes(p) ? " winner" : ""
            }`}
          >
            <span className="pname">{p.name}</span>
            <span className={`pscore${p.score < 0 ? " negative" : ""}`}>${p.score}</span>
          </div>
        ))}
      </div>
      <div className="status">
        {complete ? (
          <span className="result">
            {tie ? "Tie game!" : `${winners.map((w) => w.name).join(" & ")} wins!`}
          </span>
        ) : (
          <span className="progress">
            {state.answered.length}/{total}
          </span>
        )}
        <button className="btn reset" onClick={() => dispatch({ type: "reset" })}>
          New game
        </button>
      </div>
    </div>
  );
}
