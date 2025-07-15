import React, { useContext, useState } from "react";
import axios from "axios";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import App, { AppContext } from "../App";

export default function Login() {
  const { user, setUser } = useContext(AppContext);
  const [error, setError] = useState();
  const API_URL = import.meta.env.VITE_API_URL;
  const Navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError("Please wait...");
      const url = `${API_URL}/api/users/login`;
      const response = await axios.post(url, user);
      // console.log(response);
      setUser(response.data);
      setError("Login successfully");
      Navigate("/");
    } catch (error) {
      console.log(error);
      setError(`Error: Something went wrong`);
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
            Don't have an account?{" "}
            <Link to="/register" className="register-link">
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
