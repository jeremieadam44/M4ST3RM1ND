import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { status, user, signOut } = useAuth();

  if (status === "loading") {
    return (
      <header className="topbar">
        <div className="topbar-inner">
          <a href="/" className="brand">
            M4ST3RM1ND
          </a>
          <span className="topbar-status">Restauration de la session…</span>
        </div>
      </header>
    );
  }

  if (user) {
    return (
      <header className="topbar">
        <div className="topbar-inner">
          <a href="/" className="brand">
            M4ST3RM1ND
          </a>
          <nav aria-label="Navigation principale" className="topbar-nav">
            <span className="welcome">Bonjour, {user.username}</span>
            <button type="button" className="logout-button" onClick={signOut}>
              Se déconnecter
            </button>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a href="/" className="brand">
          M4ST3RM1ND
        </a>
        <nav
          aria-label="Navigation principale"
          className="topbar-nav topbar-auth-links"
        >
          <a href="/login">Se connecter</a>
          <a href="/register" className="primary-link">
            Créer un compte
          </a>
        </nav>
      </div>
    </header>
  );
}
