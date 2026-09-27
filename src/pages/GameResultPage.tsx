import { useCallback, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getGame, markGameSeen } from "../api/game";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import { useSession } from "../context/AuthContext";
import { parseEndData } from "../game/serialization";
import { useAsyncData } from "../hooks/useAsyncData";
import { GameResult } from "./GameResult";

/** Page /games/:gameId/result — charge la partie et affiche son résultat. */
export default function GameResultPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const { user, token } = useSession();
  const id = Number(gameId);

  const fetchGame = useCallback(() => getGame(token, id), [token, id]);
  const { data: game, loading, error, reload } = useAsyncData(fetchGame);

  // Une fois le résultat affiché, la partie sort de "Mes parties".
  useEffect(() => {
    if (game?.status === "ended") {
      markGameSeen(token, game.id).catch(() => undefined);
    }
  }, [game, token]);

  if (Number.isNaN(id))
    return <ErrorMessage message="Identifiant de partie invalide." />;
  if (loading) return <Loading label="Chargement du résultat..." />;
  if (error)
    return <ErrorMessage message={error} onRetry={() => void reload()} />;
  if (!game) return null;
  if (game.status !== "ended")
    return <Navigate to={`/games/${game.id}`} replace />;

  const endData = parseEndData(game);

  return (
    <main className="page-shell">
      {endData ? (
        <GameResult endData={endData} currentUserId={user.id} />
      ) : (
        <ErrorMessage message="Résultat illisible pour cette partie." />
      )}
      <p>
        <Link to="/games">Retour à mes parties</Link> ·{" "}
        <Link to="/history">Voir l’historique</Link>
      </p>
    </main>
  );
}
