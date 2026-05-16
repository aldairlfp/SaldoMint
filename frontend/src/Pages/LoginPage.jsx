import { useState } from "react";
import { resolveUrl } from "../utils/authFetch";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleSignIn(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    fetch(resolveUrl("auth/token"), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username, password }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Invalid username or password");
        return response.json();
      })
      .then((data) => {
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          window.location.href = "/";
        }
      })
      .catch((error) => setError(error.message));
  }

  function handleSignUp(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    fetch(resolveUrl("auth/register"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            return response.json().then((data) => {
              throw new Error(
                data.detail || "Registration failed. Please check your input.",
              );
            });
          }
          throw new Error("Registration failed");
        }
        return response.json();
      })
      .then(() => {
        setSuccess("Account created! Please sign in.");
        setUsername("");
        setPassword("");
      })
      .catch((error) => setError(error.message));
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center pb-70 overflow-y-auto">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">SaldoMint</h1>
        <p className="text-sm text-gray-500 mb-6">Sign in to your account</p>
        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Your username"
              className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
          <div className="flex flex-col gap-3 mt-2">
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg p-2 w-full transition-colors"
              onClick={handleSignIn}
            >
              Sign in
            </button>
            <button
              type="button"
              className="border border-blue-500 text-blue-500 hover:bg-blue-50 font-semibold rounded-lg p-2 w-full transition-colors"
              onClick={handleSignUp}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
