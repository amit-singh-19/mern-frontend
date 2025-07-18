import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [profile, setProfile] = useState({});
  const { user, setUser } = useContext(AppContext);
  const [error, setError] = useState();
  const [form, setForm] = useState({});
  const API_URL = import.meta.env.VITE_API_URL;
  const Navigate = useNavigate();
  const fetchProfile = async () => {
    try {
      setError("Loading...");
      const url = `${API_URL}/api/users/${user.user.id}/profile`;
      const result = await axios.get(url);
      setProfile(result.data);
      setError("");
      console.log(result.data);
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);

  const logout = () => {
    setUser({});
    Navigate("/");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      console.log(profile);
      const url = `${API_URL}/api/users/${profile._id}/profile`;
      console.log(url);

      await axios.patch(url, form);
      fetchProfile();
      setError("Data saved successfully");
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    }
  };
  return (
    <div>
      <h3>My Profile</h3>
      <p>{error}</p>
      <button onClick={logout}>Logout</button>
      <p>
        <input
          name="firstname"
          type="text"
          onChange={handleChange}
          defaultValue={profile.firstname}
        />
      </p>
      <p>
        <input
          name="lastname"
          type="text"
          onChange={handleChange}
          defaultValue={profile.lastname}
        />
      </p>
      <p>
        <input
          name="email"
          type="text"
          onChange={handleChange}
          defaultValue={profile.email}
        />
      </p>
      <p>
        <input
          name="password"
          type="text"
          onChange={handleChange}
          defaultValue={profile.password}
        />
      </p>
      <button onClick={handleSubmit}>Update Profile</button>
    </div>
  );
}
