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
          : "Impossible de créer le compte.",
      );
    }
  };

  return (
    <main>
      <h1>Créer un compte</h1>
      <form onSubmit={handleSubmit}>
        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label>
          Pseudo
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            minLength={3}
            required
          />
        </label>
        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
        </label>
        <label>
          Confirmer le mot de passe
          <input
            type="password"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            autoComplete="new-password"
            required
          />
        </label>
        {message && (
          <p role={state === "error" ? "alert" : undefined}>{message}</p>
        )}
        <button type="submit" disabled={state === "loading"}>
          {state === "loading" ? "Création..." : "Créer mon compte"}
        </button>
      </form>
      <p>
        Déjà inscrit ? <a href="/login">Se connecter</a>
      </p>
    </main>
  );
}
