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
        error instanceof Error ? error.message : "Impossible de se connecter.",
      );
    }
  };

  return (
    <main>
      <h1>Se connecter</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Pseudo ou e-mail
          <input
            type="text"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {message && (
          <p role={state === "error" ? "alert" : undefined}>{message}</p>
        )}
        <button type="submit" disabled={state === "loading"}>
          {state === "loading" ? "Connexion..." : "Se connecter"}
        </button>
      </form>
      <p>
        Pas encore de compte ? <a href="/register">Créer un compte</a>
      </p>
    </main>
  );
}
