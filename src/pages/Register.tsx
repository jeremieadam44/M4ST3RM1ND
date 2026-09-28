import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MIN_PASSWORD_LENGTH = 8;

export default function Register() {
  const { status, signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === "authenticated") return <Navigate to="/games" replace />;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(
        `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`,
      );
      return;
    }
    if (password !== confirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await signUp(email, password);
      navigate("/games");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Impossible de créer le compte.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-header">
          <span className="auth-kicker">Rejoindre M4ST3RM1ND</span>
          <h1>Créer un compte</h1>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="vous@exemple.com"
              required
            />
          </label>

          <label className="auth-field">
            <span>Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              placeholder={`Minimum ${MIN_PASSWORD_LENGTH} caractères`}
              required
            />
          </label>

          <label className="auth-field">
            <span>Confirmer le mot de passe</span>
            <input
              type="password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              autoComplete="new-password"
              placeholder="Répétez votre mot de passe"
              required
            />
          </label>

          {error && (
            <p className="auth-status error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p className="auth-footer">
          Déjà inscrit ? <Link to="/login">Se connecter</Link>
        </p>
      </section>
    </main>
  );
}
