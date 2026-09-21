import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { status, user, signOut } = useAuth();

  if (status === "loading") {
    return (
      <header>
        <a href="/">M4ST3RM1ND</a>
        <span>Restauration de la session...</span>
      </header>
    );
  }

  if (user) {
    return (
      <header>
        <a href="/">M4ST3RM1ND</a>
        <nav aria-label="Navigation principale">
          <span>Bonjour, {user.username}</span>
          <button type="button" onClick={signOut}>
            Se déconnecter
          </button>
        </nav>
      </header>
    );
  }

  return (
    <header>
      <a href="/">M4ST3RM1ND</a>
      <nav aria-label="Navigation principale">
        <a href="/login">Se connecter</a>
        <a href="/register">Créer un compte</a>
      </nav>
    </header>
  );
}
