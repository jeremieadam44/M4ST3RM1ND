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
  state: string;
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

export type UpdateGameStateInput =
  | { state: string; currentTurnUserId: number }
  | { state: string; ended: true; endData: string };
