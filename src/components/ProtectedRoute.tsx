import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

/** Route "layout" : affiche les routes enfants seulement si l'utilisateur est connecté. */
export default function ProtectedRoute() {
  const { status } = useAuth();

  if (status === "loading") {
    return <Loading label="Restauration de la session..." />;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
