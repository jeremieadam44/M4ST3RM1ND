import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type PropsWithChildren,
} from "react";
import { getSession, login, logout, register } from "../api/auth";
import type { AuthSession, User } from "../types/user";

export type AuthState = {
  status: "loading" | "authenticated" | "unauthenticated";
  user: User | null;
  token: string | null;
};

type AuthAction =
  | { type: "RESTORE"; session: AuthSession | null }
  | { type: "LOGIN"; session: AuthSession }
  | { type: "LOGOUT" };

const initialState: AuthState = {
  status: "loading",
  user: null,
  token: null,
};

export const authReducer = (
  _state: AuthState,
  action: AuthAction,
): AuthState => {
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
};

interface AuthContextValue extends AuthState {
  signIn: (identifier: string, password: string) => Promise<void>;
  signUp: (email: string, username: string, password: string) => Promise<void>;
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
    signIn: async (identifier, password) => {
      dispatch({ type: "LOGIN", session: await login(identifier, password) });
    },
    signUp: async (email, username, password) => {
      dispatch({
        type: "LOGIN",
        session: await register(email, username, password),
      });
    },
    signOut: () => {
      logout();
      dispatch({ type: "LOGOUT" });
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider.");
  }
  return context;
};
