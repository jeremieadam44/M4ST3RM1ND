import type { Difficulty } from "../types/mastermind";

export interface Parameters {
  guessSpots: number;
  maxAttempts: number;
}

export const GameModeDiff: Record<Difficulty, Parameters> = {
  easy: { guessSpots: 4, maxAttempts: 12 },
  medium: { guessSpots: 6, maxAttempts: 12 },
  hard: { guessSpots: 6, maxAttempts: 10 },
};
