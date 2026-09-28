import { useState, type FormEvent } from "react";
import { ApiError } from "../api/client";
import { createGame, getMyGames, inviteToGame, startGame } from "../api/game";
import { useSession } from "../context/AuthContext";
import { serialize } from "../game/serialization";
import type { Game } from "../types/game";
import type { GameState } from "../types/mastermind";

interface CreateGameFormProps {
  onCreated: (game: Game) => void;
}

/**
 * Crée une partie en 3 appels : création → invitation → lancement.
 * Le créateur est le codemaker et joue en premier (il choisit le code secret).
 */
export default function CreateGameForm({ onCreated }: CreateGameFormProps) {
  const { user, token } = useSession();
  const [opponentEmail, setOpponentEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = opponentEmail.trim().toLowerCase();

    if (email === user.email) {
      setError("Vous ne pouvez pas vous inviter vous-même.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const myGames = await getMyGames(token);
      const created =
        myGames.find(
          (game) =>
            game.status === "pending" &&
            game.creatorId === user.id &&
            game.players.length === 1,
        ) ?? (await createGame(token, { minPlayers: 2, maxPlayers: 2 }));
      const withOpponent = await inviteToGame(token, created.id, email);
      const opponent = withOpponent.players.find((p) => p.id !== user.id);
      if (!opponent)
        throw new Error("Adversaire introuvable après l'invitation.");

      const initialState: GameState = {
        difficulty: "easy",
        attempts: [],
        masterId: user.id,
        guesserId: opponent.id,
      };
      const started = await startGame(token, created.id, {
        state: serialize(initialState),
        currentTurnUserId: user.id,
      });

      setOpponentEmail("");
      onCreated(started);
    } catch (requestError) {
      setError(
        requestError instanceof ApiError && requestError.status === 404
          ? "Aucun joueur n'est inscrit avec cet email."
          : requestError instanceof Error
            ? requestError.message
            : "Impossible de créer la partie.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="create-game-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <p className="eyebrow">Nouvelle partie</p>
          <h2>Inviter un adversaire</h2>
        </div>
      </div>

      <label>
        Email de l'adversaire
        <input
          type="email"
          value={opponentEmail}
          onChange={(event) => setOpponentEmail(event.target.value)}
          placeholder="joueur@exemple.com"
          required
        />
      </label>
      <p className="intro">
        Vous serez le codemaker : vous choisirez le code secret à deviner.
      </p>

      <div className="form-actions">
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Création..." : "Créer la partie"}
        </button>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
