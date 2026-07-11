import type { Dispatch } from "react";
import type { Action, GameState } from "../game/types";
import { totalClues } from "../game/engine";

interface Props {
  state: GameState;
  complete: boolean;
  dispatch: Dispatch<Action>;
}

export function Scoreboard({ state, complete, dispatch }: Props) {
  const total = totalClues();
  return (
    <div className="scoreboard">
      <span className={`score${state.score < 0 ? " negative" : ""}`}>${state.score}</span>
      <span className="progress">
        {complete ? "Board complete!" : `${state.answered.length}/${total} answered`}
      </span>
      <button className="btn reset" onClick={() => dispatch({ type: "reset" })}>
        Reset
      </button>
    </div>
  );
}
