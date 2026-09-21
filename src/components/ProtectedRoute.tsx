import { useEffect, type ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { status, token } = useAuth();

  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (status === "authenticated" && !token)
    ) {
      window.location.replace("/login");
    }
  }, [status, token]);

  if (status === "loading") {
    return <p>Chargement de la session...</p>;
  }

  if (!token) {
    return null;
  }

  return children;
}
