import React, {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";
import type { GameState, Attempt, Feedback } from "../types/mastermind";

interface GameContextState {
  gameState: GameState | null;
  isMyTurn: boolean;
  status: "loading" | "error" | "ready";
}

type GameAction =
  | { type: "SET_GAME"; value: GameState }
  | { type: "SET_TURN"; value: boolean }
  | { type: "ADD_ATTEMPT"; value: Attempt }
  | { type: "ADD_FEEDBACK"; value: Feedback }
  | { type: "SET_STATUS"; value: "loading" | "error" | "ready" };

const initialState: GameContextState = {
  gameState: null,
  isMyTurn: false,
  status: "loading",
};

function gameReducer(
  state: GameContextState,
  action: GameAction,
): GameContextState {
  switch (action.type) {
    case "SET_GAME":
      return { ...state, gameState: action.value, status: "ready" };
    case "SET_TURN":
      return { ...state, isMyTurn: action.value };
    case "ADD_ATTEMPT":
      if (!state.gameState) return state;
      return {
        ...state,
        gameState: {
          ...state.gameState,
          attempts: [...state.gameState.attempts, action.value],
        },
      };
    case "ADD_FEEDBACK":
      if (!state.gameState) return state;
      const lastIndex = state.gameState.attempts.length - 1;
      const lastAttempt = {
        ...state.gameState.attempts[lastIndex],
        feedback: action.value,
      };
      const updatedAttempt = [
        ...state.gameState.attempts.slice(0, lastIndex),
        lastAttempt,
      ];
      return {
        ...state,
        gameState: { ...state.gameState, attempts: updatedAttempt },
      };
    case "SET_STATUS":
      return { ...state, status: action.value };
    default:
      return state;
  }
}

const GameContext = createContext<
  { state: GameContextState; dispatch: React.Dispatch<GameAction> } | undefined
>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame doit etre utilisé dnas un GameProvider");
  }
  return context;
}
