import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { GameModeDiff } from "../game/constants";
import { saveSecret, getSecret } from "../game/secretStorage";
import { isVictoryEasy, isGameOver } from "../game/mastermindLogic";
import { GameResult } from "./GameResult";
import type { Color, Tips, EndData } from "../types/mastermind";

import { mockGameStateEasy, mockGameStateGuessTurn } from "../game/mockData"; // import temporaire de dev test

const COLORS: Color[] = [
  "red",
  "blue",
  "green",
  "yellow",
  "cyan",
  "magenta",
  "orange",
  "purple",
];

const TIPS: Tips[] = ["red", "white", "empty"];

const CURRENT_USER_ID = 1; // dev data en dur a remove au branchement de l'api

function ColorRow({ colors }: { colors: Color[] }) {
  return (
    <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
      {colors.map((c, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            width: 30,
            height: 30,
            borderRadius: "50%",
            backgroundColor: c,
          }}
        />
      ))}
    </div>
  );
}

function TipsRow({ tips }: { tips: Tips[] }) {
  return (
    <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
      {tips.map((t, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            width: 24,
            height: 24,
            borderRadius: "50%",
            backgroundColor: t === "empty" ? "transparent" : t,
            border:
              t === "empty" ? "2px solid gray" : "1px solid rgba(0,0,0,0.3)",
          }}
        />
      ))}
    </div>
  );
}

export function GameBoard() {
  const { gameId } = useParams();
  const { state, dispatch } = useGame();

  const [guess, setGuess] = useState<Color[]>([]);
  const [feedback, setFeedback] = useState<Tips[]>([]);
  const [secret, setSecret] = useState<Color[]>([]);
  const [endData, setEndData] = useState<EndData | null>(null);

  useEffect(() => {
    dispatch({ type: "SET_STATUS", value: "loading" });
    const timer = setTimeout(() => {
      dispatch({ type: "SET_GAME", value: mockGameStateEasy });
      dispatch({ type: "SET_TURN", value: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [dispatch]);

  if (state.status === "loading") return <p>Chargement...</p>;
  if (state.status === "error") return <p>Une erreur est survenue.</p>;
  if (!state.gameState) return <p>Aucune partir trouvée.</p>;
  if (endData) {
    return <GameResult endData={endData} currentUserId={CURRENT_USER_ID} />;
  }

  const { difficulty, attempts, masterId } = state.gameState;
  const mode = GameModeDiff[difficulty];
  const isCodemaker = masterId === CURRENT_USER_ID;

  const lastAttempt = attempts[attempts.length - 1];
  const waitingForFeddback = Boolean(lastAttempt && !lastAttempt.feedback);

  const localSecret = gameId ? getSecret(gameId) : null;
  const secretNeeded = isCodemaker && attempts.length === 0 && !localSecret;

  function creatSecret(color: Color) {
    if (secret.length >= mode.guessSpots) return;
    setSecret([...secret, color]);
  }

  function validateSecret() {
    if (!gameId) return;
    saveSecret(gameId, secret);
    setSecret([]);
    dispatch({ type: "SET_TURN", value: false });
  }

  function guessColor(color: Color) {
    if (guess.length >= mode.guessSpots) return;
    setGuess([...guess, color]);
  }

  function validateGuess() {
    dispatch({ type: "ADD_ATTEMPT", value: { guess: guess } });
    setGuess([]);
    dispatch({ type: "SET_TURN", value: false });
  }

  function advising(tip: Tips) {
    if (feedback.length >= mode.guessSpots) return;
    setFeedback([...feedback, tip]);
  }

  function validteAdvising() {
    if (!lastAttempt || !state.gameState) return;

    const completedFeedback = { pose: feedback };
    dispatch({ type: "ADD_FEEDBACK", value: completedFeedback });

    const finishedAttempt = { ...lastAttempt, feedback: completedFeedback };
    const won = isVictoryEasy(finishedAttempt);
    const lost = !won && isGameOver(state.gameState, mode.maxAttempts);

    if (won || lost) {
      setEndData({
        revealedCode: localSecret ?? [],
        winnerId: won ? state.gameState.guesserId : state.gameState.masterId,
      });
    }
    setFeedback([]);
    dispatch({ type: "SET_TURN", value: false });
  }

  return (
    <div>
      <h1>Partie</h1>
      <p>{state.isMyTurn ? "A vous de jouer" : "En attente de l'adversaire"}</p>
      <h2>Tentatives Precedentes</h2>
      {attempts.map((attempt, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <span>Essais {i + 1} : </span>
          {attempt.feedback?.pose && <TipsRow tips={attempt.feedback.pose} />}
          <ColorRow colors={attempt.guess} />
        </div>
      ))}

      {secretNeeded && (
        <div>
          <h2>Choisissez votre code secret !</h2>
          <div>
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => creatSecret(c)}
                style={{
                  backgroundColor: c,
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
          <div>
            Votre Code : <ColorRow colors={secret} />
          </div>
          <button
            disabled={secret.length !== mode.guessSpots}
            onClick={validateSecret}
          >
            Valider le code
          </button>
        </div>
      )}

      {state.isMyTurn && !isCodemaker && !waitingForFeddback && (
        <div>
          <h2>Votre proposition</h2>
          <div>
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => guessColor(c)}
                style={{
                  backgroundColor: c,
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
          <div>
            Selection : <ColorRow colors={guess} />
          </div>
          <button
            disabled={guess.length !== mode.guessSpots}
            onClick={validateGuess}
          >
            Valider la Propale
          </button>
        </div>
      )}
      {state.isMyTurn && isCodemaker && waitingForFeddback && lastAttempt && (
        <div>
          <h2>Definissez les indices : {lastAttempt.guess.join(", ")}</h2>
          <p>
            Votre code est :{" "}
            {localSecret ? <ColorRow colors={localSecret} /> : "introuvable"}
          </p>
          <div>
            {TIPS.map((t) => (
              <button
                key={t}
                onClick={() => advising(t)}
                style={{
                  backgroundColor: t === "empty" ? "transparent" : t,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  border: t === "empty" ? "2px solid gray" : "none",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
          <div>
            Indices : <TipsRow tips={feedback} />
          </div>
          <button
            disabled={feedback.length !== mode.guessSpots}
            onClick={validteAdvising}
          >
            Valider les indices
          </button>
        </div>
      )}
    </div>
  );
}
