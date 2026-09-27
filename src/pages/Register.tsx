import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";

type SubmissionState = "idle" | "loading" | "error" | "success";

export default function Register() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [state, setState] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (password.length < 8) {
      setState("error");
      setMessage("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirmation) {
      setState("error");
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setState("loading");
    try {
      await signUp(email, username, password);
      setState("success");
      setMessage("Compte créé. Redirection en cours...");
      window.setTimeout(() => window.location.assign("/"), 400);
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Impossible de créer le compte. Vérifie que l’API est démarrée.",
      );
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
            <span>Pseudo</span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              minLength={3}
              placeholder="Votre pseudo"
            />
          </label>

          <label className="auth-field">
            <span>Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="Minimum 8 caractères"
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
            {state === "loading" ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p className="auth-footer">
          Déjà inscrit ? <a href="/login">Se connecter</a>
        </p>
      </section>
    </main>
  );
}
