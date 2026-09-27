import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";

type SubmissionState = "idle" | "loading" | "error" | "success";

export default function Login() {
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("loading");
    setMessage("");

    try {
      await signIn(identifier, password);
      setState("success");
      setMessage("Connexion réussie.");
      window.setTimeout(() => window.location.assign("/"), 400);
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Impossible de se connecter. Vérifie que l’API est démarrée.",
      );
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-header">
          <span className="auth-kicker">M4ST3RM1ND</span>
          <h1>Se connecter</h1>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Adresse e-mail</span>
            <input
              type="email"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
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
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />
          </label>

          {message && (
            <p
              className={
                state === "error" ? "auth-status error" : "auth-status success"
              }
              role={state === "error" ? "alert" : undefined}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={state === "loading"}
          >
            {state === "loading" ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="auth-footer">
          Pas encore de compte ? <a href="/register">Créer un compte</a>
        </p>
      </section>
    </main>
  );
}
