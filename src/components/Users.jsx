import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState();
  const API_URL = import.meta.env.VITE_API_URL;
  const handleDelete = async (id) => {
    try {
      const url = `${API_URL}/api/users/${id}`;
      await axios.delete(url);
      setError("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.log(error.message);
      setError("Something went wrong");
    }
  };
  const fetchUsers = async () => {
    try {
      setError("Loading...");
      const url = `${API_URL}/api/users`;
      const result = await axios.get(url);
      setUsers(result.data);
      setError();
    } catch (error) {
      console.log(error.message);
      setError("Something went wrong");
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <>
      <h2>User List</h2>
      <p>{error}</p>
      {users.map((user) => (
        <li key={user._id}>
          {user.firstname}{" "}
          <button onClick={() => handleDelete(user._id)}>Delete</button>
        </li>
      ))}
    </>
  );
}
