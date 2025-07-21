import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AppContext from "../context/AppContext";
import "./Products.css";
import { FilePenLine, Trash2, Search, Plus, X } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const { user } = useContext(AppContext);
  const [error, setError] = useState();
  const frmRef = useRef();
  const [form, setForm] = useState({
    productName: "",
    description: "",
    price: "",
    imgUrl: "",
  });
  const [page, setPage] = useState(1);
  const [searchVal, setSearchVal] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);
  const [editId, setEditId] = useState();
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchProducts = async () => {
    try {
      const url = `${API_URL}/api/products/?page=${page}&limit=${limit}&search=${searchVal}`;
      const result = await axios.get(url);
      setProducts(result.data.products);
      setTotalPages(result.data.total);
      setError();
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
      setError("Something went wrong while fetching products.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchVal]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ productName: "", description: "", price: "", imgUrl: "" });
    frmRef.current.reset();
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!frmRef.current.checkValidity()) {
      frmRef.current.reportValidity();
      return;
    }
    try {
      const url = `${API_URL}/api/products`;
      await axios.post(url, form, {
        headers: { Authorization: `Bearer ${user.token}` }, // Added Auth
      });
      toast.success("Product added successfully");
      fetchProducts();
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add product");
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setForm({
      productName: product.productName,
      description: product.description,
      price: product.price,
      imgUrl: product.imgUrl,
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
      const url = `${API_URL}/api/products/${editId}`;
      await axios.patch(url, form, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success("Product updated successfully");
      fetchProducts();
      setEditId(null);
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update product");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const url = `${API_URL}/api/products/${id}`;
        await axios.delete(url, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        toast.success("Product deleted successfully");
        fetchProducts();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete product");
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
    fetchProducts();
  };

  return (
    <div className="admin-panel-container !mt-0 !pt-0" style={{marginTop: 0, paddingTop: 0}}>
      <div className="form-card">
        <h3>{editId ? "Edit Product" : "Add New Product"}</h3>
        <form
          ref={frmRef}
          onSubmit={editId ? handleUpdate : handleAdd}
          className="user-form"
        >
          <div className="form-row">
            <input
              name="productName"
              value={form.productName}
              type="text"
              placeholder="Product Name"
              onChange={handleChange}
              required
              className="form-input"
            />
            <input
              name="price"
              value={form.price}
              type="number"
              placeholder="Price"
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <textarea
            name="description"
            value={form.description}
            placeholder="Product Description"
            onChange={handleChange}
            required
            className="form-input form-textarea"
          />
          <input
            name="imgUrl"
            value={form.imgUrl}
            type="url"
            placeholder="Image URL"
            onChange={handleChange}
            required
            className="form-input"
          />
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
                <Plus size={16} /> Add Product
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="panel-header">
        <h2>Product Management</h2>
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Search by name..."
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
              <th>Image</th>
              <th>Product Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p._id}>
                  <td data-label="Image">
                    <img
                      src={`/${p.imgUrl}`}
                      alt={p.productName}
                      className="product-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/60x60/e2e8f0/475569?text=No+Image";
                      }}
                    />
                  </td>
                  <td data-label="Product Name">{p.productName}</td>
                  <td data-label="Description" className="description-cell">
                    {p.description}
                  </td>
                  <td data-label="Price">{p.price}</td>
                  <td data-label="Actions" className="action-buttons">
                    <button
                      onClick={() => handleEdit(p)}
                      className="btn-icon btn-edit"
                    >
                      <FilePenLine />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
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
                  No products found.
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
