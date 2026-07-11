import type { Board } from "./types";

// Values ascend with difficulty: 200 (Learn-level) up to 1000 (deep cuts).
// Every clue carries a `source` tag mapping it back to one of the six areas:
// learn / reference / community / blog / devto / reddit.

export const VALUES = [200, 400, 600, 800, 1000] as const;

export const BOARD: Board = [
  {
    name: "Hook, Line & Sinker",
    clues: [
      {
        value: 200,
        prompt: "This Hook lets a function component add a state variable, returning the current value and a setter.",
        response: "What is useState?",
        source: "learn",
      },
      {
        value: 400,
        prompt: "Call this Hook to read the value provided by the nearest matching Context Provider above in the tree.",
        response: "What is useContext?",
        source: "learn",
      },
      {
        value: 600,
        prompt: "This Hook caches the result of an expensive calculation so it is not recomputed on every render.",
        response: "What is useMemo?",
        source: "reference",
      },
      {
        value: 800,
        prompt: "This Hook returns a memoized function identity so a memoized child does not re-render needlessly.",
        response: "What is useCallback?",
        source: "reference",
      },
      {
        value: 1000,
        prompt: "This React 18 Hook generates a unique, hydration-safe ID, handy for linking a label to its input.",
        response: "What is useId?",
        source: "reference",
      },
    ],
  },
  {
    name: "Side Effects May Include",
    clues: [
      {
        value: 200,
        prompt: "This Hook synchronizes a component with an external system after the render is committed.",
        response: "What is useEffect?",
        source: "learn",
      },
      {
        value: 400,
        prompt: "Returning this from an Effect lets React tear down before the next run and on unmount.",
        response: "What is a cleanup function?",
        source: "learn",
      },
      {
        value: 600,
        prompt: "An empty version of this array makes an Effect run only once, after the component mounts.",
        response: "What is the dependency array?",
        source: "learn",
      },
      {
        value: 800,
        prompt: 'The react.dev guide "You Might Not Need an ___" says derived data belongs in render, not here.',
        response: "What is an Effect?",
        source: "blog",
      },
      {
        value: 1000,
        prompt: "In development, Strict Mode does this to every Effect to help you spot missing cleanup.",
        response: "What is run it twice (mount, unmount, remount)?",
        source: "community",
      },
    ],
  },
  {
    name: "Render & Prejudice",
    clues: [
      {
        value: 200,
        prompt: "React needs this stable prop on each list item to match elements across renders.",
        response: "What is a key?",
        source: "learn",
      },
      {
        value: 400,
        prompt: "Using this as a key is an anti-pattern because it breaks when the list reorders or filters.",
        response: "What is the array index?",
        source: "community",
      },
      {
        value: 600,
        prompt: "Wrap a component in this API to skip re-rendering when its props are shallow-equal.",
        response: "What is React.memo?",
        source: "reference",
      },
      {
        value: 800,
        prompt: "This is the name for React's process of diffing the element tree to compute minimal DOM updates.",
        response: "What is reconciliation?",
        source: "learn",
      },
      {
        value: 1000,
        prompt: "Changing this special prop on a component unmounts and remounts it, resetting all of its state.",
        response: "What is the key?",
        source: "reference",
      },
    ],
  },
  {
    name: "The Suspense Is Killing Me",
    clues: [
      {
        value: 200,
        prompt: "Wrap lazily loaded content in this component to display a fallback while it loads.",
        response: "What is Suspense?",
        source: "reference",
      },
      {
        value: 400,
        prompt: "This function defers loading a component's code until the component is first rendered.",
        response: "What is lazy (React.lazy)?",
        source: "reference",
      },
      {
        value: 600,
        prompt: "This Hook marks a state update as non-urgent, keeping the UI responsive during heavy renders.",
        response: "What is useTransition?",
        source: "reference",
      },
      {
        value: 800,
        prompt: "Suspense catches thrown promises; this component pattern catches thrown render errors.",
        response: "What is an error boundary?",
        source: "community",
      },
      {
        value: 1000,
        prompt: "This Hook lets you keep showing a stale value while a fresher one is being prepared.",
        response: "What is useDeferredValue?",
        source: "reference",
      },
    ],
  },
  {
    name: "Server, Please",
    clues: [
      {
        value: 200,
        prompt: "These components run on the server and ship no client JS for themselves, reducing bundle size.",
        response: "What are React Server Components?",
        source: "blog",
      },
      {
        value: 400,
        prompt: "Put this directive at the top of a file to opt its components into running in the browser.",
        response: "What is 'use client'?",
        source: "reference",
      },
      {
        value: 600,
        prompt: "This directive marks a function as a Server Function that the client can call across the network.",
        response: "What is 'use server'?",
        source: "reference",
      },
      {
        value: 800,
        prompt: "This react-dom/server API streams server-rendered HTML to the browser in a Node environment.",
        response: "What is renderToPipeableStream?",
        source: "reference",
      },
      {
        value: 1000,
        prompt: "This project, released as 1.0 in 2025, auto-memoizes code so you can delete most useMemo and useCallback.",
        response: "What is the React Compiler?",
        source: "blog",
      },
    ],
  },
  {
    name: "Community Chest",
    clues: [
      {
        value: 200,
        prompt: "This common smell is threading props through many layers just to reach a deeply nested child.",
        response: "What is prop drilling?",
        source: "community",
      },
      {
        value: 400,
        prompt: "The recurring r/reactjs panic: in dev with Strict Mode, a component appears to render this many times.",
        response: "What is twice?",
        source: "reddit",
      },
      {
        value: 600,
        prompt: "The fix r/reactjs usually suggests for prop drilling before reaching for a full state library.",
        response: "What is the Context API?",
        source: "reddit",
      },
      {
        value: 800,
        prompt: "This dev.to-favorite library (formerly React Query) handles server state, caching, and refetching.",
        response: "What is TanStack Query?",
        source: "devto",
      },
      {
        value: 1000,
        prompt: "Calling a Hook inside a condition or loop violates this numbered set of guidelines.",
        response: "What are the Rules of Hooks?",
        source: "community",
      },
    ],
  },
];
