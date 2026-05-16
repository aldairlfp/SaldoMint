import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TransactionPage from "./Pages/TransactionPage";
import StatsPage from "./Pages/StatsPage";
import LoginPage from "./Pages/LoginPage";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/login";
  }

  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col">
        <nav className="bg-gray-800 text-white p-4 flex gap-4">
          <Link to="/" className="hover:underline">
            Transactions
          </Link>
          <Link to="/stats" className="hover:underline">
            Stats
          </Link>
          {!token && (
            <Link to="/login" className="hover:underline">
              Login
            </Link>
          )}
          {token && (
            <button onClick={handleLogout} className="hover:underline">
              Logout
            </button>
          )}
        </nav>

        <main className="flex-1 overflow-auto">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <TransactionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stats"
              element={
                <ProtectedRoute>
                  <StatsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
