import type { Dispatch } from "react";
import type { Action, GameState } from "../game/types";
import { standings, leaders, totalClues } from "../game/engine";

const MEDALS = ["🥇", "🥈", "🥉"];

interface Props {
  state: GameState;
  dispatch: Dispatch<Action>;
}

export function GameOver({ state, dispatch }: Props) {
  const ranked = standings(state);
  const winners = leaders(state);
  const solo = state.players.length === 1;
  const tie = !solo && winners.length === state.players.length;

  const headline = solo
    ? `Final score: $${state.players[0].score}`
    : tie
      ? "It's a tie!"
      : `${winners.map((w) => w.name).join(" & ")} wins!`;

  return (
    <div className="gameover">
      <div className="go-badge">🏆</div>
      <h2 className="go-headline">Game over</h2>
      <p className="go-result">{headline}</p>
      <p className="go-sub">All {totalClues()} clues reviewed</p>

      <ol className="standings">
        {ranked.map((p, i) => (
          <li key={p.name} className={`standing${winners.includes(p) ? " win" : ""}`}>
            <span className="rank">{!tie && MEDALS[i] ? MEDALS[i] : `#${i + 1}`}</span>
            <span className="sname">{p.name}</span>
            <span className={`sscore${p.score < 0 ? " neg" : ""}`}>${p.score}</span>
          </li>
        ))}
      </ol>

      <button className="btn play-again" onClick={() => dispatch({ type: "reset" })}>
        Play again
      </button>
    </div>
  );
}
