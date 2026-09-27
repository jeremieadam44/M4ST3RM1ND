import type { AuthSession } from "../types/user";
import { apiRequest } from "./client";

const SESSION_KEY = "m4st3rm1nd.session";

interface AuthResponse {
  token: string;
  user: { id: number; email: string; profilePicture: string | null };
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const toDisplayName = (email: string) => email.split("@")[0] || "Joueur";

const toSession = ({ token, user }: AuthResponse): AuthSession => ({
  token,
  user: {
    id: user.id,
    email: user.email,
    username: toDisplayName(user.email),
    profilePicture: user.profilePicture ?? null,
  },
});

const saveSession = (session: AuthSession) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export function getSession(): AuthSession | null {
  try {
    const value = localStorage.getItem(SESSION_KEY);
    return value ? (JSON.parse(value) as AuthSession) : null;
  } catch {
    return null;
  }
}

export async function register(
  email: string,
  password: string,
): Promise<AuthSession> {
  const response = await apiRequest<AuthResponse>("/auth/signup", {
    method: "POST",
    body: { email: normalizeEmail(email), password },
  });
  const session = toSession(response);
  saveSession(session);
  return session;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthSession> {
  const response = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: { email: normalizeEmail(email), password },
  });
  const session = toSession(response);
  saveSession(session);
  return session;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}
