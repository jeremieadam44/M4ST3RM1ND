import type { Attempt, GameState } from "../types/mastermind";

export function isVictoryEasy(runingGame: Attempt): boolean {
  return runingGame.feedback?.pose?.every((e) => e === "red") || false;
}

export function isVictoryMH(runingGame: Attempt, guessSpots: number): boolean {
  return runingGame.feedback?.red === guessSpots;
}

export function isGameOver(game: GameState, maxAttempts: number): boolean {
  if (game.attempts.length === maxAttempts) {
    return true;
  }
  return false;
}
