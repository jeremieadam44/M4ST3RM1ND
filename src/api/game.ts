import type {
  CreateGameInput,
  Game,
  StartGameInput,
  UpdateGameStateInput,
} from "../types/game";
import { apiRequest } from "./client";

export const getMyGames = (token: string) =>
  apiRequest<Game[]>("/games/mine", { token });

export const getGameHistory = (token: string) =>
  apiRequest<Game[]>("/games/history", { token });

export const getGame = (token: string, gameId: number) =>
  apiRequest<Game>(`/games/${gameId}`, { token });

export const createGame = (token: string, input: CreateGameInput) =>
  apiRequest<Game>("/games", { method: "POST", body: input, token });

export const inviteToGame = (token: string, gameId: number, email: string) =>
  apiRequest<Game>(`/games/${gameId}/invite`, {
    method: "POST",
    body: { email },
    token,
  });

export const startGame = (
  token: string,
  gameId: number,
  input: StartGameInput,
) =>
  apiRequest<Game>(`/games/${gameId}/start`, {
    method: "POST",
    body: input,
    token,
  });

export const updateGameState = (
  token: string,
  gameId: number,
  input: UpdateGameStateInput,
) =>
  apiRequest<Game>(`/games/${gameId}/state`, {
    method: "PUT",
    body: input,
    token,
  });

export const markGameSeen = (token: string, gameId: number) =>
  apiRequest<void>(`/games/${gameId}/seen`, { method: "POST", token });
