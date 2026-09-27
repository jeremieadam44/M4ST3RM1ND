import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import { GameBoard } from "./pages/GameBoard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/test/:gameId"
          element={
            <GameProvider>
              <GameBoard />
            </GameProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
