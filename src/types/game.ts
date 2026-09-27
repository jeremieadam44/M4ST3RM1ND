/** Types calqués sur la forme <Game> renvoyée par le serveur (voir README du game-server). */

export type GameStatus = "pending" | "started" | "ended";

export interface Player {
  id: number;
  email: string;
  profilePicture: string | null;
}

export interface Game {
  id: number;
  creatorId: number;
  minPlayers: number;
  maxPlayers: number;
  status: GameStatus;
  players: Player[];
  currentTurnUserId: number | null;
  isYourTurn: boolean;
  /** Chaîne opaque : notre GameState Mastermind sérialisé en JSON. */
  state: string;
  /** Chaîne opaque : notre EndData sérialisé en JSON (null tant que la partie n'est pas finie). */
  endData: string | null;
  createdAt: string;
  startedAt: string | null;
  endedAt: string | null;
}

export interface CreateGameInput {
  minPlayers: number;
  maxPlayers: number;
}

export interface StartGameInput {
  state: string;
  currentTurnUserId: number;
}

/** Corps de PUT /games/:id/state : soit on passe la main, soit on termine la partie. */
export type UpdateGameStateInput =
  | { state: string; currentTurnUserId: number }
  | { state: string; ended: true; endData: string };
