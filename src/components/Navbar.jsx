import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import AppContext from "../context/AppContext";

export default function Navbar() {
  const { user } = useContext(AppContext);
  // console.log(user);
  return (
    <div className="navbar">
      <div className="list-item">
        <Link to="/">Home</Link>
      </div>
      <div className="list-item">
        <Link to="/cart">MyCart</Link>
      </div>
      <div className="list-item">
        <Link to="/order">MyOrder</Link>
      </div>
      {user.user?.role === "admin" && (
        <div className="list-item">
          <Link to="/admin">Admin</Link>
        </div>
      )}

      {user?.token ?  (
        <div className="list-item">
          <Link to="/profile">Profile</Link>
        </div>
      ) : (
        <div className="list-item">
          <Link to="/login">Login</Link>
        </div>
      )}
    </div>
  );
}
