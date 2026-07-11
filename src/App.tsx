import { useReducer } from "react";
import { reducer, createInitialState, isComplete } from "./game/engine";
import { BOARD } from "./game/questions";
import { Board } from "./components/Board";
import { ClueModal } from "./components/ClueModal";
import { Scoreboard } from "./components/Scoreboard";
import { Setup } from "./components/Setup";

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const complete = isComplete(state);
  const selectedClue = state.selected
    ? BOARD[state.selected.c].clues[state.selected.q]
    : null;

  return (
    <div className="app">
      <header className="topbar">
        <h1>
          React <span className="accent">Jeopardy</span>
        </h1>
        {state.phase === "playing" && (
          <Scoreboard state={state} complete={complete} dispatch={dispatch} />
        )}
      </header>

      {state.phase === "setup" ? (
        <Setup dispatch={dispatch} />
      ) : (
        <>
          <Board board={BOARD} state={state} dispatch={dispatch} />
          {selectedClue && (
            <ClueModal
              clue={selectedClue}
              revealed={state.revealed}
              currentPlayerName={state.players[state.currentPlayer]?.name ?? ""}
              dispatch={dispatch}
            />
          )}
        </>
      )}
    </div>
  );
}
