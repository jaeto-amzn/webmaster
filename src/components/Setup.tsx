import { useState } from "react";
import type { Dispatch } from "react";
import type { Action } from "../game/types";
import { MIN_PLAYERS, MAX_PLAYERS } from "../game/engine";

interface Props {
  dispatch: Dispatch<Action>;
}

export function Setup({ dispatch }: Props) {
  const [count, setCount] = useState(1);
  const options = Array.from(
    { length: MAX_PLAYERS - MIN_PLAYERS + 1 },
    (_, i) => MIN_PLAYERS + i,
  );

  return (
    <div className="setup">
      <h2>How many players?</h2>
      <div className="player-choices">
        {options.map((n) => (
          <button
            key={n}
            className={`choice${count === n ? " selected" : ""}`}
            onClick={() => setCount(n)}
            aria-pressed={count === n}
          >
            {n}
          </button>
        ))}
      </div>
      <button className="btn start" onClick={() => dispatch({ type: "start", players: count })}>
        Start game
      </button>
    </div>
  );
}
