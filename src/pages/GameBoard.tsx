import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { GameModeDiff } from "../game/constants";
import { saveSecret, getSecret } from "../game/secretStorage";
import type { Color, Tips } from "../types/mastermind";
import { mockGameStateEasy } from "../game/mockData"; // import temporaire de dev test

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

const tips: Tips[] = ["red", "white", "empty"];

const CURRENT_USER_ID = 2; // dev data en dur a remove au branchement de l'api

export function GameBoard() {
  const { gameId } = useParams();
  const { state, dispatch } = useGame();

  const [guess, setGuess] = useState<Color[]>([]);
  const [feedback, setFeedback] = useState<Tips[]>([]);
  const [secret, setSecret] = useState<Color[]>([]);

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
    dispatch({ type: "ADD_FEEDBACK", value: { pose: feedback } });
    setFeedback([]);
    dispatch({ type: "SET_TURN", value: false });
  }

  return (
    <div>
      <h1>Partie</h1>
      <p>{state.isMyTurn ? "A vous de jouer" : "En attente de l'adversaire"}</p>
    </div>
  );
}
