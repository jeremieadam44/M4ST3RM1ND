import { GameModeDiff } from "../game/constants";
import type { Difficulty } from "../types/mastermind";

interface DifficultySelectProps {
  onSelect: (difficulty: Difficulty) => void;
}

export function DifficultySelect({ onSelect }: DifficultySelectProps) {
  const dificulties: Difficulty[] = ["easy", "medium", "hard"];

  return (
    <div>
      {dificulties.map((diff) => (
        <button
          key={diff}
          disabled={diff !== "easy"}
          onClick={() => onSelect(diff)}
        >
          {diff} -- {GameModeDiff[diff].guessSpots} Pions,{" "}
          {GameModeDiff[diff].maxAttempts} Essais.
          {diff !== "easy" && "(biento disponible)"}
        </button>
      ))}
    </div>
  );
}
