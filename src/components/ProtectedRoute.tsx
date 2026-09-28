import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

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
