import type { EndData } from "../types/mastermind";

interface GameResultProps {
  endData: EndData;
  currentUserId: number;
}

export function GameResult({ endData, currentUserId }: GameResultProps) {
  const hasWon = endData.winnerId === currentUserId;

  return (
    <div>
      <h1>{hasWon ? "Victoire !" : "Défaite !"}</h1>
      <p>Le code secret était :</p>
      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "center",
          marginTop: 12,
        }}
      >
        {endData.revealedCode.map((color, index) => (
          <span
            key={index}
            style={{
              display: "inline-block",
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: color,
              border: "1px solid rgba(0,0,0,0.2)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
