import type { AuthSession, User } from "../types/user";

const USERS_KEY = "m4st3rm1nd.users";
const SESSION_KEY = "m4st3rm1nd.session";

interface StoredUser extends User {
  passwordHash: string;
  salt: string;
}

const getStorage = () =>
  typeof window === "undefined" ? null : window.localStorage;

const normalize = (value: string) => value.trim().toLowerCase();

const readUsers = (): StoredUser[] => {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const value = storage.getItem(USERS_KEY);
    return value ? (JSON.parse(value) as StoredUser[]) : [];
  } catch {
    return [];
  }
};

const bytesToHex = (bytes: Uint8Array) =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

const createRandomValue = (size: number) => {
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
};

const hashPassword = async (password: string, salt: string) => {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode(salt),
      iterations: 120_000,
      hash: "SHA-256",
    },
    key,
    256,
  );
  return bytesToHex(new Uint8Array(bits));
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
  const normalizedUsername = normalize(username);
  const users = readUsers();

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error("Cette adresse e-mail est déjà utilisée.");
  }
  if (users.some((user) => normalize(user.username) === normalizedUsername)) {
    throw new Error("Ce pseudo est déjà utilisé.");
  }

  const salt = createRandomValue(16);
  const user: StoredUser = {
    id: createRandomValue(12),
    email: normalizedEmail,
    username: username.trim(),
    passwordHash: await hashPassword(password, salt),
    salt,
  };
  getStorage()?.setItem(USERS_KEY, JSON.stringify([...users, user]));

  const session: AuthSession = {
    user: { id: user.id, email: user.email, username: user.username },
    token: createRandomValue(32),
  };
  saveSession(session);
  return session;
};

export const login = async (
  identifier: string,
  password: string,
): Promise<AuthSession> => {
  const normalizedIdentifier = normalize(identifier);
  const user = readUsers().find(
    (candidate) =>
      candidate.email === normalizedIdentifier ||
      normalize(candidate.username) === normalizedIdentifier,
  );

  if (
    !user ||
    (await hashPassword(password, user.salt)) !== user.passwordHash
  ) {
    throw new Error("Identifiant ou mot de passe incorrect.");
  }

  const session: AuthSession = {
    user: { id: user.id, email: user.email, username: user.username },
    token: createRandomValue(32),
  };
  saveSession(session);
  return session;
};

export const logout = () => {
  getStorage()?.removeItem(SESSION_KEY);
};
