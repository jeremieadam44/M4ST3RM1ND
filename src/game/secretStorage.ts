import type { Color } from "../types/mastermind";

export function saveSecret(gameId: string, secret: Color[]): void {
  localStorage.setItem(`code_${gameId}`, JSON.stringify(secret));
}

export function getSecret(gameId: string): Color[] | null {
  const code = localStorage.getItem(`code_${gameId}`);
  if (!code) return null;
  return JSON.parse(code);
}
