import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { status, user, signOut } = useAuth();

  return (
    <header>
      <a href="/">M4ST3RM1ND</a>
      <nav aria-label="Navigation principale">
        {status === "loading" ? (
          <span>Restauration de la session...</span>
        ) : user ? (
          <>
            <span>Bonjour, {user.username}</span>
            <button type="button" onClick={signOut}>
              Se déconnecter
            </button>
          </>
        ) : (
          <>
            <a href="/login">Se connecter</a>
            <a href="/register">Créer un compte</a>
          </>
        )}
      </nav>
    </header>
  );
}
