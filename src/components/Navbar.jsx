import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import AppContext from "../context/AppContext";

export default function Navbar() {
  const { user } = useContext(AppContext);
  // console.log(user);
  return (
    <div className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo-link">
          <img src="/images/logo.png" alt="logo" className="logo" />
        </Link>
      </div>

      <div className="navbar-center">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/cart" className="nav-link">
          My Cart
        </Link>
        <Link to="/order" className="nav-link">
          My Orders
        </Link>
        {user.user?.role === "admin" && (
          <Link to="/admin" className="nav-link">
            Admin
          </Link>
        )}
      </div>

      <div className="navbar-right">
        {user?.token ? (
          <Link to="/profile" className="nav-link">
            Profile
          </Link>
        ) : (
          <Link to="/login" className="nav-link btn btn-primary">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
