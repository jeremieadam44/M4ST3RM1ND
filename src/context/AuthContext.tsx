import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type PropsWithChildren,
} from "react";
import { getSession, login, logout, register } from "../api/auth";
import type { AuthSession, User } from "../types/user";

export interface AuthState {
  status: "loading" | "authenticated" | "unauthenticated";
  user: User | null;
  token: string | null;
}

type AuthAction =
  | { type: "RESTORE"; session: AuthSession | null }
  | { type: "LOGIN"; session: AuthSession }
  | { type: "LOGOUT" };

const initialState: AuthState = {
  status: "loading",
  user: null,
  token: null,
};

export function authReducer(_state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "RESTORE":
    case "LOGIN":
      return action.session
        ? {
            status: "authenticated",
            user: action.session.user,
            token: action.session.token,
          }
        : { status: "unauthenticated", user: null, token: null };
    case "LOGOUT":
      return { status: "unauthenticated", user: null, token: null };
  }
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    dispatch({ type: "RESTORE", session: getSession() });
  }, []);

  const value: AuthContextValue = {
    ...state,
    signIn: async (email, password) => {
      dispatch({ type: "LOGIN", session: await login(email, password) });
    },
    signUp: async (email, password) => {
      dispatch({ type: "LOGIN", session: await register(email, password) });
    },
    signOut: () => {
      logout();
      dispatch({ type: "LOGOUT" });
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider.");
  }
  return context;
}

/** À utiliser dans les pages protégées : user et token sont garantis non nuls. */
export function useSession(): { user: User; token: string } {
  const { user, token } = useAuth();
  if (!user || !token) {
    throw new Error("useSession doit être utilisé dans une route protégée.");
  }
  return { user, token };
}
