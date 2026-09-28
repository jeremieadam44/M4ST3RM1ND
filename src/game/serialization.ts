import type { Game } from "../types/game";
import type { EndData, GameState } from "../types/mastermind";

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export const parseGameState = (game: Game) => safeParse<GameState>(game.state);

export const parseEndData = (game: Game) => safeParse<EndData>(game.endData);

export const serialize = (value: GameState | EndData) => JSON.stringify(value);
