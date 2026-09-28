import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { GameModeDiff } from "../game/constants";
import { saveSecret, getSecret } from "../game/secretStorage";
import { isVictoryEasy, isGameOver } from "../game/mastermindLogic";
import type { Color, Tips } from "../types/mastermind";

import { getGame, updateGameState } from "../api/game";
import { useSession } from "../context/AuthContext";
import { parseGameState, serialize } from "../game/serialization";

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
  const { gameId } = useParams<{ gameId: string }>();
  const { user, token } = useSession();
  const navigate = useNavigate();
  const id = Number(gameId);

  const { state, dispatch } = useGame();

  const [guess, setGuess] = useState<Color[]>([]);
  const [feedback, setFeedback] = useState<Tips[]>([]);
  const [secret, setSecret] = useState<Color[]>([]);

  const [sending, setSending] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadGame = useCallback(async () => {
    try {
      const game = await getGame(token, id);
      if (game.status === "ended") {
        navigate(`/games/${id}/result`);
        return;
      }
      if (game.status === "pending") {
        dispatch({
          type: "SET_ERROR",
          value: "La partie n'a pas encore commence",
        });
        return;
      }
      const gameState = parseGameState(game);
      if (!gameState) {
        dispatch({ type: "SET_ERROR", value: "Etat de la partir illisible" });
        return;
      }
      dispatch({ type: "SET_GAME", value: gameState });
      dispatch({ type: "SET_TURN", value: game.isYourTurn });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        value: error instanceof Error ? error.message : "Erreur de chargement",
      });
    }
  }, [token, id, navigate, dispatch]);

  useEffect(() => {
    void loadGame();
  }, [loadGame]);

  useEffect(() => {
    if (state.isMyTurn) return;
    const inter = setInterval(loadGame, 3000);
    return () => clearInterval(inter);
  }, [state.isMyTurn, loadGame]);

  if (state.status === "loading")
    return (
      <main className="page-shell">
        <section className="game-board">Chargement...</section>
      </main>
    );
  if (state.status === "error")
    return (
      <main className="page-shell">
        <section className="game-board">Une erreur est survenue.</section>
      </main>
    );
  if (!state.gameState)
    return (
      <main className="page-shell">
        <section className="game-board">Aucune partir trouvée.</section>
      </main>
    );

  const { difficulty, attempts, masterId } = state.gameState;
  const mode = GameModeDiff[difficulty];
  const isCodemaker = masterId === user.id;

  const lastAttempt = attempts[attempts.length - 1];
  const waitingForFeddback = Boolean(lastAttempt && !lastAttempt.feedback);

  const localSecret = gameId ? getSecret(gameId) : null;
  const secretNeeded = isCodemaker && attempts.length === 0 && !localSecret;

  function creatSecret(color: Color) {
    if (secret.length >= mode.guessSpots) return;
    setSecret([...secret, color]);
  }

  async function validateSecret() {
    if (!gameId || !state.gameState) return;
    saveSecret(gameId, secret);
    setSending(true);
    setActionError(null);
    try {
      await updateGameState(token, id, {
        state: serialize(state.gameState),
        currentTurnUserId: state.gameState.guesserId,
      });
      setSecret([]);
      await loadGame();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Echec de l'envoie",
      );
    } finally {
      setSending(false);
    }
  }

  function guessColor(color: Color) {
    if (guess.length >= mode.guessSpots) return;
    setGuess([...guess, color]);
  }

  async function validateGuess() {
    if (!state.gameState) return;
    const update = {
      ...state.gameState,
      attempts: [...state.gameState.attempts, { guess }],
    };
    setSending(true);
    setActionError(null);
    try {
      await updateGameState(token, id, {
        state: serialize(update),
        currentTurnUserId: state.gameState.masterId,
      });
      setGuess([]);
      await loadGame();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Echec de l'envoie",
      );
    } finally {
      setSending(false);
    }
  }

  function advising(tip: Tips) {
    if (feedback.length >= mode.guessSpots) return;
    setFeedback([...feedback, tip]);
  }

  async function validteAdvising() {
    if (!lastAttempt || !state.gameState) return;

    const completedFeedback = { pose: feedback };
    const finishedAttempt = { ...lastAttempt, feedback: completedFeedback };

    const attempts = [
      ...state.gameState.attempts.slice(0, -1),
      finishedAttempt,
    ];
    const update = { ...state.gameState, attempts };

    const won = isVictoryEasy(finishedAttempt);
    const lost = !won && isGameOver(update, mode.maxAttempts);

    setSending(true);
    setActionError(null);
    try {
      if (won || lost) {
        const endData = {
          revealedCode: localSecret ?? [],
          winnerId: won ? state.gameState.guesserId : state.gameState.masterId,
        };
        await updateGameState(token, id, {
          state: serialize(update),
          ended: true,
          endData: serialize(endData),
        });
        navigate(`/games/${id}/result`);
        return;
      }
      await updateGameState(token, id, {
        state: serialize(update),
        currentTurnUserId: state.gameState.guesserId,
      });
      setFeedback([]);
      await loadGame();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Echec de l'envoie",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="game-board">
        <h1>Partie</h1>
        <p>
          {state.isMyTurn ? "A vous de jouer" : "En attente de l'adversaire"}
        </p>
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
              onClick={() => setSecret(secret.slice(0, -1))}
              disabled={secret.length === 0 || sending}
            >
              Retirer
            </button>
            <button
              disabled={secret.length !== mode.guessSpots || sending}
              onClick={validateSecret}
            >
              {sending ? "Envoie......" : "Valider le code"}
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
              onClick={() => setGuess(guess.slice(0, -1))}
              disabled={guess.length === 0 || sending}
            >
              Retirer
            </button>
            <button
              disabled={guess.length !== mode.guessSpots || sending}
              onClick={validateGuess}
            >
              {sending ? "Envoie......" : "Valider la Propale"}
            </button>
          </div>
        )}
        {state.isMyTurn && isCodemaker && waitingForFeddback && lastAttempt && (
          <div>
            <div>
              Rappel de votre code :{" "}
              {localSecret ? <ColorRow colors={localSecret} /> : "introuvable"}
            </div>

            <h2>Definissez les indices pour : </h2>
            <ColorRow colors={lastAttempt.guess} />
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
                    marginTop: 15,
                    margin: 2,
                  }}
                />
              ))}
            </div>
            <div>
              Indices : <TipsRow tips={feedback} />
            </div>
            <button
              onClick={() => setFeedback(feedback.slice(0, -1))}
              disabled={feedback.length === 0 || sending}
            >
              Retirer
            </button>
            <button
              disabled={feedback.length !== mode.guessSpots || sending}
              onClick={validteAdvising}
            >
              {sending ? "Envoie......" : "Valider les indices"}
            </button>
          </div>
        )}
        {actionError && <p style={{ color: "#b91c1c" }}>{actionError}</p>}
      </section>
    </main>
  );
}
