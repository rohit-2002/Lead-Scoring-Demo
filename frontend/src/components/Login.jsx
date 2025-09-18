import React, { useState } from "react";
import axios from "axios";
import { apiUrl } from "../utils/api.js";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const loginUrl = apiUrl("/auth/login");
      console.log("Attempting login to:", loginUrl);
      const res = await axios.post(loginUrl, {
        username,
        password,
      });
      if (res.data.ok) {
        onLogin(res.data.token);
      } else {
        setError("Invalid credentials");
      }
    } catch {
      setError("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-sm mx-auto">
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-white rounded shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Lead Scoring Demo
          </h2>
          {error && <div className="mb-2 text-red-600">{error}</div>}
          <div className="mb-2">
            <label className="block mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded px-2 py-1"
              placeholder="admin"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-2 py-1"
              placeholder="password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
