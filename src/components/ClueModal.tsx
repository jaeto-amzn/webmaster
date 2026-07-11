import type { Dispatch } from "react";
import type { Action, Clue, Source } from "../game/types";

const SOURCE_LABEL: Record<Source, string> = {
  learn: "Learn",
  reference: "Reference",
  community: "Community",
  blog: "Blog",
  devto: "dev.to",
  reddit: "r/reactjs",
};

interface Props {
  clue: Clue;
  revealed: boolean;
  currentPlayerName: string;
  dispatch: Dispatch<Action>;
}

export function ClueModal({ clue, revealed, currentPlayerName, dispatch }: Props) {
  return (
    <div className="overlay" onClick={() => dispatch({ type: "close" })}>
      <div
        className="clue-card"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="clue-meta">
          <span className="value">${clue.value}</span>
          <span className="turn">{currentPlayerName}&rsquo;s turn</span>
          <span className="source">{SOURCE_LABEL[clue.source]}</span>
        </div>

        <p className="prompt">{clue.prompt}</p>

        {revealed ? (
          <>
            <p className="response">{clue.response}</p>
            <div className="actions">
              <button className="btn correct" onClick={() => dispatch({ type: "answer", correct: true })}>
                Correct (+${clue.value})
              </button>
              <button className="btn wrong" onClick={() => dispatch({ type: "answer", correct: false })}>
                Wrong (-${clue.value})
              </button>
            </div>
          </>
        ) : (
          <div className="actions">
            <button className="btn reveal" onClick={() => dispatch({ type: "reveal" })}>
              Reveal answer
            </button>
            <button className="btn skip" onClick={() => dispatch({ type: "close" })}>
              Skip
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
