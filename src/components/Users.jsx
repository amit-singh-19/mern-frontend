import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AppContext from "../context/AppContext";
import "./Users.css"; 
import { FilePenLine, Trash2, Search, Plus, X } from "lucide-react"; 

export default function Users() {
  const [users, setUsers] = useState([]);
  const { user } = useContext(AppContext);
  const [error, setError] = useState();
  const frmRef = useRef();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "",
  });
  const [page, setPage] = useState(1);
  const [searchVal, setSearchVal] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(4); 
  const [editId, setEditId] = useState();
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchUsers = async () => {
    try {
      const url = `${API_URL}/api/users/?page=${page}&limit=${limit}&search=${searchVal}`;
      const result = await axios.get(url, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(result.data.users);
      setTotalPages(result.data.total);
      setError();
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to load users");
      setError("Something went wrong while fetching users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchVal]); // Re-fetch when page or searchVal changes

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ firstname: "", lastname: "", email: "", password: "", role: "" });
    frmRef.current.reset();
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!frmRef.current.checkValidity()) {
      frmRef.current.reportValidity();
      return;
    }
    try {
      const url = `${API_URL}/api/users`;
      await axios.post(url, form, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success("User added successfully");
      fetchUsers();
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add user");
    }
  };

  const handleEdit = (user) => {
    setEditId(user._id);
    setForm({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      password: "", 
      role: user.role,
    });
    window.scrollTo(0, 0); 
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!frmRef.current.checkValidity()) {
      frmRef.current.reportValidity();
      return;
    }
    try {
      const updateData = { ...form };
      if (!updateData.password) {
        delete updateData.password;
      }

      const url = `${API_URL}/api/users/${editId}`;
      await axios.patch(url, updateData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success("User updated successfully");
      fetchUsers();
      setEditId(null);
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update user");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const url = `${API_URL}/api/users/${id}`;
        await axios.delete(url, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        toast.success("User deleted successfully");
        fetchUsers();
      } catch (error) {
        console.error(error.message);
        toast.error("Failed to delete user");
      }
    }
  };

  const handleCancel = () => {
    setEditId(null);
    resetForm();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); 
    fetchUsers();
  };

  return (
    <div className="admin-panel-container !mt-0 !pt-0" style={{marginTop: 0, paddingTop: 0}}>
      <div className="form-card">
        <h3>{editId ? "Edit User" : "Add New User"}</h3>
        <form
          ref={frmRef}
          onSubmit={editId ? handleUpdate : handleAdd}
          className="user-form"
        >
          <div className="form-row">
            <input
              name="firstname"
              value={form.firstname}
              type="text"
              placeholder="First Name"
              onChange={handleChange}
              required
              className="form-input"
            />
            <input
              name="lastname"
              value={form.lastname}
              type="text"
              placeholder="Last Name"
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-row">
            <input
              name="email"
              value={form.email}
              type="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
              className="form-input"
            />
            <select
              name="role"
              value={form.role}
              required
              onChange={handleChange}
              className="form-input"
            >
              <option value="">-- Select Role --</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-row">
            <input
              name="password"
              value={form.password}
              type="password"
              placeholder={editId ? "New Password (Optional)" : "Password"}
              onChange={handleChange}
              required={!editId}
              minLength={!editId ? 6 : 0}
              className="form-input"
            />
          </div>
          <div className="form-actions">
            {editId ? (
              <>
                <button type="submit" className="btn btn-primary">
                  <FilePenLine size={16} /> Update
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary"
                >
                  <X size={16} /> Cancel
                </button>
              </>
            ) : (
              <button type="submit" className="btn btn-primary">
                <Plus size={16} /> Add User
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="panel-header">
        <h2>User Management</h2>
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Search by name or email..."
            onChange={(e) => setSearchVal(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn-search">
            <Search />
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email Address</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u._id}>
                  <td data-label="First Name">{u.firstname}</td>
                  <td data-label="Last Name">{u.lastname}</td>
                  <td data-label="Email">{u.email}</td>
                  <td data-label="Role">
                    <span className={`role-badge role-${u.role}`}>
                      {u.role}
                    </span>
                  </td>
                  <td data-label="Actions" className="action-buttons">
                    <button
                      onClick={() => handleEdit(u)}
                      className="btn-icon btn-edit"
                    >
                      <FilePenLine />
                    </button>
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="btn-icon btn-delete"
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-container">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="btn"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="btn"
        >
          Next
        </button>
      </div>
    </div>
  );
}
