export type GameStatus = 'WAITING' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED' | string

export interface GamePlayer {
	id?: string
	email?: string
	username?: string
	name?: string
}

export interface Game {
	id: string
	status?: GameStatus
	difficulty?: string
	currentPlayerId?: string
	currentTurnUserId?: string
	turnUserId?: string
	winnerId?: string | null
	winner?: GamePlayer | null
	players?: GamePlayer[]
	opponent?: GamePlayer | null
	moves?: number
	moveCount?: number
	attempts?: number
	createdAt?: string
	finishedAt?: string
	updatedAt?: string
}

export interface CreateGameInput {
	difficulty?: string
	invitedEmails: string[]
}
