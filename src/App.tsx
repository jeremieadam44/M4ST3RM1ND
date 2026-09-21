import "./App.css";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const path = window.location.pathname;

  return (
    <AuthProvider>
      <NavBar />
      {path === "/login" ? (
        <Login />
      ) : path === "/register" ? (
        <Register />
      ) : (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      )}
    </AuthProvider>
  );
}

function Home() {
  const { user, token } = useAuth();

  return (
    <main>
      <h1>Bienvenue, {user?.username}</h1>
      <p>Ta session est active et prête pour les appels API.</p>
      <p>Token disponible : {token ? "oui" : "non"}</p>
    </main>
  );
}

export default App;
