import type { EndData } from "../types/mastermind";

interface GameResultProps {
  endData: EndData;
  currentUserId: number;
}

export function GameResult({ endData, currentUserId }: GameResultProps) {
  const hasWon = endData.winnerId === currentUserId;

  return (
    <div>
      <h1>{hasWon ? "Victoire ! " : "Defaite !"}</h1>
      <p>Le code secret était :</p>
      <div>
        {endData.revealedCode.map((color, index) => (
          <span key={index} style={{ backgroundColor: color }}>
            {color}
          </span>
        ))}
      </div>
    </div>
  );
}
