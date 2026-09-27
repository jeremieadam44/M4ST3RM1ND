import type { AuthSession } from "../types/user";

const SESSION_KEY = "m4st3rm1nd.session";
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const getStorage = () =>
  typeof window === "undefined" ? null : window.localStorage;

const normalize = (value: string) => value.trim().toLowerCase();

const toDisplayName = (email: string, fallback?: string) => {
  const base = fallback?.trim();
  if (base && base.length > 0) return base;

  const localPart = email.split("@")[0]?.trim();
  return localPart || "Joueur";
};

const parseJson = async (response: Response) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data?.error === "string"
        ? data.error
        : "Erreur de connexion à l’API.";
    throw new Error(message);
  }

  return data;
};

const apiRequest = async <T>(
  path: string,
  method: string,
  body?: Record<string, string | undefined | null>,
) => {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await parseJson(response);
    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "Le serveur de jeu n’est pas démarré. Lance d’abord le dossier game-server avec deno task dev.",
    );
  }
};

export const getSession = (): AuthSession | null => {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const value = storage.getItem(SESSION_KEY);
    return value ? (JSON.parse(value) as AuthSession) : null;
  } catch {
    return null;
  }
};

const saveSession = (session: AuthSession) => {
  getStorage()?.setItem(SESSION_KEY, JSON.stringify(session));
};

export const register = async (
  email: string,
  username: string,
  password: string,
): Promise<AuthSession> => {
  const normalizedEmail = normalize(email);

  const response = await apiRequest<{
    token: string;
    user: { id: number; email: string; profilePicture?: string | null };
  }>("/auth/signup", "POST", {
    email: normalizedEmail,
    password,
    username: username.trim() || undefined,
  });

  const session: AuthSession = {
    token: response.token,
    user: {
      id: response.user.id,
      email: response.user.email,
      username: toDisplayName(response.user.email, username),
      profilePicture: response.user.profilePicture ?? null,
    },
  };

  saveSession(session);
  return session;
};

export const login = async (
  identifier: string,
  password: string,
): Promise<AuthSession> => {
  const email = normalize(identifier);

  const response = await apiRequest<{
    token: string;
    user: { id: number; email: string; profilePicture?: string | null };
  }>("/auth/login", "POST", {
    email,
    password,
  });

  const session: AuthSession = {
    token: response.token,
    user: {
      id: response.user.id,
      email: response.user.email,
      username: toDisplayName(response.user.email, identifier),
      profilePicture: response.user.profilePicture ?? null,
    },
  };

  saveSession(session);
  return session;
};

export const logout = () => {
  getStorage()?.removeItem(SESSION_KEY);
};
