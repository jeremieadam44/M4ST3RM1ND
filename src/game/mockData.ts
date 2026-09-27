// ⚠️ Fichier temporaire, uniquement pour développer/tester l'UI en isolation.
// À SUPPRIMER avant le rendu final, une fois l'API réellement branchée.

import type { GameState, Attempt, EndData } from "../types/mastermind";

// --- Mode easy : une tentative déjà jouée avec feedback, une en attente ---
export const mockAttemptsEasy: Attempt[] = [
  {
    guess: ["red", "blue", "green", "yellow"],
    feedback: {
      pose: ["red", "empty", "red", "white"],
    },
  },
  {
    guess: ["red", "green", "green", "yellow"],
    // pas de feedback : simule un tour en attente du codemaker
  },
];

export const mockGameStateEasy: GameState = {
  difficulty: "easy",
  attempts: mockAttemptsEasy,
  masterId: 1,
  guesserId: 2,
};

// --- Mode easy : aucune tentative encore jouée, c'est au guesser de proposer ---
export const mockGameStateGuessTurn: GameState = {
  difficulty: "easy",
  attempts: [],
  masterId: 1, // vous devez être CURRENT_USER_ID = 2 (guesser) pour ce test
  guesserId: 2,
};

// --- Mode medium : feedback en comptage rouge/blanc, pas positionnel ---
export const mockAttemptsMedium: Attempt[] = [
  {
    guess: ["red", "blue", "green", "yellow", "cyan", "orange"],
    feedback: {
      red: 2,
      white: 1,
    },
  },
  {
    guess: ["red", "blue", "purple", "yellow", "cyan", "magenta"],
    // pas de feedback : tour en attente
  },
];

export const mockGameStateMedium: GameState = {
  difficulty: "medium",
  attempts: mockAttemptsMedium,
  masterId: 1,
  guesserId: 2,
};

// --- Une partie gagnée, pour tester GameResult ---
export const mockGameStateWon: GameState = {
  difficulty: "easy",
  attempts: [
    {
      guess: ["red", "blue", "green", "yellow"],
      feedback: { pose: ["red", "red", "red", "red"] },
    },
  ],
  masterId: 1,
  guesserId: 2,
};

export const mockEndData: EndData = {
  revealedCode: ["red", "blue", "green", "yellow"],
  winnerId: 2,
};
