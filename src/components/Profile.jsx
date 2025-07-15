import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AppContext } from "../App";

export default function Profile() {
  const [profile, setProfile] = useState({});
  const { user } = useContext(AppContext);
  const [error, setError] = useState();
  const API_URL = import.meta.env.VITE_API_URL;
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
  return (
    <div>
      <h3>My Profile</h3>
      <p>{error}</p>
      <p>
        <input type="text" defaultValue={profile.firstname} />
      </p>
      <p>
        <input type="text" defaultValue={profile.lastname} />
      </p>
      <p>
        <input type="text" defaultValue={profile.email} />
      </p>
      <p>
        <input type="text" defaultValue={profile.password} />
      </p>
      <button>Update Profile</button>
    </div>
  );
}
