import { useCallback } from "react";
import { Link } from "react-router-dom";
import { getGameHistory } from "../api/game";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import { useSession } from "../context/AuthContext";
import { parseEndData, parseGameState } from "../game/serialization";
import { useAsyncData } from "../hooks/useAsyncData";

/** Les dates SQLite ("2026-09-14 12:00:00") sont en UTC. */
const formatDate = (sqliteDate: string | null) =>
  sqliteDate
    ? new Date(`${sqliteDate.replace(" ", "T")}Z`).toLocaleDateString()
    : "—";

export default function History() {
  const { user, token } = useSession();

  const fetchHistory = useCallback(() => getGameHistory(token), [token]);
  const { data: games, loading, error, reload } = useAsyncData(fetchHistory);

  return (
    <main className="page-shell">
      <div className="page-title">
        <div>
          <p className="eyebrow">Archives</p>
          <h1>Historique</h1>
          <p className="intro">Vos résultats précédents, partie par partie.</p>
        </div>
      </div>

      <section className="panel history-panel">
        {loading ? (
          <Loading label="Chargement de l’historique..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={() => void reload()} />
        ) : !games || games.length === 0 ? (
          <p className="state-message">Votre historique est vide.</p>
        ) : (
          <div className="history-list">
            {games.map((game) => {
              const won = parseEndData(game)?.winnerId === user.id;
              const moves = parseGameState(game)?.attempts.length ?? 0;
              return (
                <Link
                  className="history-row"
                  key={game.id}
                  to={`/games/${game.id}/result`}
                >
                  <span>
                    <strong>Partie #{game.id}</strong>
                    <small>{formatDate(game.endedAt)}</small>
                  </span>
                  <span className={won ? "result win" : "result loss"}>
                    {won ? "Victoire" : "Défaite"}
                  </span>
                  <span className="moves">
                    {moves} essai{moves > 1 ? "s" : ""}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
