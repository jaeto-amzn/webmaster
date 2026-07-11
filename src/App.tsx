import { useReducer } from "react";
import { reducer, createInitialState, isComplete } from "./game/engine";
import { BOARD } from "./game/questions";
import { Board } from "./components/Board";
import { ClueModal } from "./components/ClueModal";
import { Scoreboard } from "./components/Scoreboard";

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
        <Scoreboard state={state} complete={complete} dispatch={dispatch} />
      </header>

      <Board board={BOARD} state={state} dispatch={dispatch} />

      {selectedClue && (
        <ClueModal clue={selectedClue} revealed={state.revealed} dispatch={dispatch} />
      )}
    </div>
  );
}
