import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="page-shell">
      <h1>Page introuvable</h1>
      <p>
        <Link to="/">Retour à l’accueil</Link>
      </p>
    </main>
  );
}
