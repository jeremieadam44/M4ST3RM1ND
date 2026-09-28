import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { GameProvider } from "./context/GameContext";
import { GameBoard } from "./pages/GameBoard";
import GameList from "./pages/GameList";
import GameResultPage from "./pages/GameResultPage";
import History from "./pages/History";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Rules from "./pages/Rules";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/games" replace />} />
            <Route path="/games" element={<GameList />} />
            <Route
              path="/games/:gameId"
              element={
                // Un GameProvider par partie : l'état repart de zéro à chaque partie ouverte.
                <GameProvider>
                  <GameBoard />
                </GameProvider>
              }
            />
            <Route path="/games/:gameId/result" element={<GameResultPage />} />
            <Route path="/history" element={<History />} />
            <Route path="/rules" element={<Rules />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
