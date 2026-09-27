import { useCallback, useEffect, useState } from 'react'
import { getMyGames } from '../api/game'
import CreateGameForm from '../components/CreateGameForm'
import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
import type { Game } from '../types/game'

interface GameListProps { token: string; userId?: string }

function gameLabel(game: Game) { return game.opponent?.name ?? game.opponent?.email ?? `${game.players?.length ?? 0} joueur(s)` }

export default function GameList({ token, userId }: GameListProps) {
	const [games, setGames] = useState<Game[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const loadGames = useCallback(async () => {
		setLoading(true); setError(null)
		try { setGames(await getMyGames(token)) } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Impossible de charger vos parties.') } finally { setLoading(false) }
	}, [token])

	useEffect(() => { void loadGames() }, [loadGames])
	const openGame = (id: string) => { window.history.pushState({}, '', `/games/${id}`); window.dispatchEvent(new PopStateEvent('popstate')) }

	return <main className="page-shell"><div className="page-title"><div><p className="eyebrow">Mastermind</p><h1>Vos parties</h1><p className="intro">Retrouvez vos parties en cours et lancez une nouvelle invitation.</p></div><span className="count-badge">{games.length} en cours</span></div>
		<div className="content-grid"><CreateGameForm token={token} onCreated={(game) => setGames((current) => [game, ...current])} />
			<section className="panel game-panel"><div className="panel-heading"><h2>Parties en cours</h2><button className="icon-button" type="button" onClick={() => void loadGames()} aria-label="Actualiser">↻</button></div>
				{loading ? <Loading label="Chargement de vos parties..." /> : error ? <ErrorMessage message={error} onRetry={() => void loadGames()} /> : games.length === 0 ? <p className="state-message">Aucune partie en cours.</p> : <div className="game-list">{games.map((game) => { const myTurn = game.currentPlayerId === userId || game.currentTurnUserId === userId || game.turnUserId === userId; return <button className="game-row" key={game.id} type="button" onClick={() => openGame(game.id)}><span className="game-row-main"><strong>Partie #{game.id.slice(0, 8)}</strong><span>avec {gameLabel(game)}</span></span><span className={myTurn ? 'turn-indicator active' : 'turn-indicator'}>{myTurn ? 'C’est votre tour' : 'Tour adverse'}<small>{game.status ?? 'En cours'}</small></span></button> })}</div>}
			</section>
		</div>
	</main>
}
