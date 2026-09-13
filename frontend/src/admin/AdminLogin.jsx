import React, { useState } from "react";
import {
  LockKeyhole,
  LogIn,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const API = "http://localhost:5000/api";

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem(
        "adf_admin",
        JSON.stringify({
          username,
        })
      );

      onLogin();
    } catch (error) {
      setError(
        error.message || "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">

        {/* BRAND */}
        <div className="admin-brand-icon">
          🐟
        </div>

        <div className="admin-login-heading">
          <span>ANDHRA DRY FISH</span>

          <h1>Admin Panel</h1>

          <p>
            Manage your orders and store from one place.
          </p>
        </div>

        {/* SECURITY */}
        <div className="admin-security">
          <ShieldCheck size={18} />

          <span>
            Secure Admin Access
          </span>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin}>

          {/* USERNAME */}
          <label>
            Username
          </label>

          <div className="admin-input-wrap">

            <UserRound size={18} />

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              autoComplete="username"
            />

          </div>

          {/* PASSWORD */}
          <label>
            Password
          </label>

          <div className="admin-input-wrap">

            <LockKeyhole size={18} />

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete="current-password"
            />

          </div>

          {/* ERROR */}
          {error && (
            <div className="admin-error">
              {error}
            </div>
          )}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >

            <LogIn size={18} />

            {loading
              ? "Signing in..."
              : "Login to Dashboard"}

          </button>

        </form>

        {/* FOOTER */}
        <div className="admin-login-footer">
          Andhra Dry Fish © 2026
        </div>

      </div>
    </div>
  );
}