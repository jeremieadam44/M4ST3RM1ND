import type { CreateGameInput, Game } from '../types/game'

const API_URL = import.meta.env.VITE_API_URL ?? '/api'

async function request<T>(token: string, path: string, options?: RequestInit): Promise<T> {
	const response = await fetch(`${API_URL}${path}`, {
		...options,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
			...options?.headers,
		},
	})

	if (!response.ok) {
		let message = `La requête a échoué (${response.status})`
		try {
			const body = await response.json() as { message?: string; error?: string }
			message = body.message ?? body.error ?? message
		} catch {
            
		}
		throw new Error(message)
	}

	if (response.status === 204) return undefined as T
	return response.json() as Promise<T>
}

function unwrapGames(payload: Game[] | { games?: Game[] }): Game[] {
	return Array.isArray(payload) ? payload : payload.games ?? []
}

export async function getMyGames(token: string): Promise<Game[]> {
	return unwrapGames(await request<Game[] | { games?: Game[] }>(token, '/games/mine'))
}

export async function getGameHistory(token: string): Promise<Game[]> {
	return unwrapGames(await request<Game[] | { games?: Game[] }>(token, '/games/history'))
}

export async function createGame(token: string, input: CreateGameInput): Promise<Game> {
	return request<Game>(token, '/games', {
		method: 'POST',
		body: JSON.stringify(input),
	})
}
