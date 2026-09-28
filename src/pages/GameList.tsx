import { useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyGames } from "../api/game";
import CreateGameForm from "../components/CreateGameForm";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import { useSession } from "../context/AuthContext";
import { useAsyncData } from "../hooks/useAsyncData";
import type { Game } from "../types/game";

function turnLabel(game: Game): string {
  if (game.status === "pending") return "En attente de lancement";
  if (game.status === "ended") return "Terminée — voir le résultat";
  return game.isYourTurn ? "C’est votre tour" : "Tour adverse";
}

export default function GameList() {
  const { user, token } = useSession();
  const navigate = useNavigate();

  const fetchGames = useCallback(() => getMyGames(token), [token]);
  const { data: games, loading, error, reload } = useAsyncData(fetchGames);

  useEffect(() => {
    const interval = setInterval(() => void reload(), 3000);
    return () => clearInterval(interval);
  }, [reload]);

  const opponentEmail = (game: Game) =>
    game.players.find((player) => player.id !== user.id)?.email ?? "personne";

  const gamePath = (game: Game) =>
    game.status === "ended" ? `/games/${game.id}/result` : `/games/${game.id}`;

  return (
    <main className="page-shell">
      <div className="page-title">
        <div>
          <p className="eyebrow">Mastermind</p>
          <h1>Vos parties</h1>
          <p className="intro">
            Retrouvez vos parties en cours et lancez une nouvelle invitation.
          </p>
        </div>
        <span className="count-badge">{games?.length ?? 0} en cours</span>
      </div>

      <div className="content-grid">
        <CreateGameForm onCreated={(game) => navigate(`/games/${game.id}`)} />

        <section className="panel game-panel">
          <div className="panel-heading">
            <h2>Parties en cours</h2>
            <button
              className="icon-button"
              type="button"
              onClick={() => void reload()}
              aria-label="Actualiser"
            >
              ↻
            </button>
          </div>

          {loading && !games ? (
            <Loading label="Chargement de vos parties..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={() => void reload()} />
          ) : !games || games.length === 0 ? (
            <p className="state-message">Aucune partie en cours.</p>
          ) : (
            <div className="game-list">
              {games.map((game) => (
                <Link className="game-row" key={game.id} to={gamePath(game)}>
                  <span className="game-row-main">
                    <strong>Partie #{game.id}</strong>
                    <span>avec {opponentEmail(game)}</span>
                  </span>
                  <span
                    className={
                      game.status === "started" && game.isYourTurn
                        ? "turn-indicator active"
                        : "turn-indicator"
                    }
                  >
                    {turnLabel(game)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
