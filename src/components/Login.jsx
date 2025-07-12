import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import { Link } from "react-router-dom";

export default function Login() {
  const [user, setUser] = useState({});
  const [error, setError] = useState();
  const API_URL = import.meta.env.VITE_API_URL;
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError("Please wait...")
      const url = `${API_URL}/api/users/login`;
      const response = await axios.post(url, user);
      console.log(response)
      setError("Login successfully");
    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };
  return (
    <>
      <div className="login-container">
        <h1>Login</h1>
        <p className="error">{error}</p>
        <form onSubmit={handleLogin}>
          <div className="input-field">
            <input
              type="email"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="input-field">
            <input
              type="password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            />
            <label htmlFor="password">Password</label>
          </div>
          <button type="submit">Login</button>
          <p>
            Don't have an account? <Link to="/register" className="register-link">Create Account</Link>
          </p>
        </form>
      </div>
    </>
  );
}
