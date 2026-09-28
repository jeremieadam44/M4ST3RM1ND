import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { status, user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="brand">
          M4ST3RM1ND
        </Link>

        {status === "loading" && (
          <span className="topbar-status">Restauration de la session…</span>
        )}

        {status === "authenticated" && user && (
          <nav aria-label="Navigation principale" className="topbar-nav">
            <NavLink to="/games" end className="nav-link">
              Mes parties
            </NavLink>
            <NavLink to="/history" className="nav-link">
              Historique
            </NavLink>
            <NavLink to="/rules" className="nav-link">
              Règles
            </NavLink>
            <span className="welcome">Bonjour, {user.username}</span>
            <button
              type="button"
              className="logout-button"
              onClick={handleSignOut}
            >
              Se déconnecter
            </button>
          </nav>
        )}

        {status === "unauthenticated" && (
          <nav
            aria-label="Navigation principale"
            className="topbar-nav topbar-auth-links"
          >
            <NavLink to="/login">Se connecter</NavLink>
            <NavLink to="/register" className="primary-link">
              Créer un compte
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  );
}
