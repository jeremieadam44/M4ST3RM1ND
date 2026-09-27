import { useCallback, useEffect, useState } from 'react'
import { getGameHistory } from '../api/game'
import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
import type { Game } from '../types/game'

interface HistoryProps { token: string; userId?: string }

export default function History({ token, userId }: HistoryProps) {
	const [games, setGames] = useState<Game[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null)
	const loadHistory = useCallback(async () => { setLoading(true); setError(null); try { setGames(await getGameHistory(token)) } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Impossible de charger votre historique.') } finally { setLoading(false) } }, [token])
	useEffect(() => { void loadHistory() }, [loadHistory])
	return <main className="page-shell"><div className="page-title"><div><p className="eyebrow">Archives</p><h1>Historique</h1><p className="intro">Vos résultats précédents, partie par partie.</p></div></div><section className="panel history-panel">{loading ? <Loading label="Chargement de l’historique..." /> : error ? <ErrorMessage message={error} onRetry={() => void loadHistory()} /> : games.length === 0 ? <p className="state-message">Votre historique est vide.</p> : <div className="history-list">{games.map((game) => { const won = game.winnerId === userId || game.winner?.id === userId; const moves = game.moves ?? game.moveCount ?? game.attempts ?? 0; return <div className="history-row" key={game.id}><span><strong>Partie #{game.id.slice(0, 8)}</strong><small>{game.finishedAt ? new Date(game.finishedAt).toLocaleDateString() : 'Terminée'}</small></span><span className={won ? 'result win' : 'result loss'}>{won ? 'Victoire' : 'Défaite'}</span><span className="moves">{moves} coup{moves === 1 ? '' : 's'}</span></div> })}</div>}</section></main>
}
