import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AppContext from "../context/AppContext";
import "./Orders.css";
import { CheckCircle, XCircle } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState();
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Show more orders per page
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");
  const { user } = useContext(AppContext);
  const API_URL = import.meta.env.VITE_API_URL;

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const fetchOrders = async () => {
    try {
      const url = `${API_URL}/api/orders/?page=${page}&limit=${limit}&status=${status}`;
      const result = await axios.get(url, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log(result);
      setOrders(result.data.orders);
      setTotalPages(result.data.total);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders");
      setError("Something went wrong while fetching orders.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status, page]);

  const updateOrder = async (orderId, newStatus) => {
    try {
      const url = `${API_URL}/api/orders/${orderId}`;
      await axios.patch(
        url,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders(); // Refresh the list
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status");
    }
  };

  return (
    <div className="admin-panel-container !mt-0 !pt-0" style={{marginTop: 0, paddingTop: 0}}>
      <div className="panel-header">
        <h2>Order Management</h2>
        <div className="filter-container">
          <label htmlFor="status-filter">Filter by status:</label>
          <select
            id="status-filter"
            className="form-input filter-select"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1); // Reset to first page when filter changes
            }}
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Order Date</th>
              <th>Total Value</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map(
                (order) => (
                  console.log(order),
                  (
                    <tr key={order._id}>
                      <td data-label="Order ID" className="order-id-cell">
                        {order._id}
                      </td>

                      <td data-label="Order Date">
                        {formatDate(order.createdAt)}
                      </td>
                      <td data-label="Total Value">₹{order.orderValue}</td>
                      <td data-label="Status">
                        <span className={`status-badge status-${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td data-label="Actions" className="action-buttons">
                        {order.status === "Pending" && (
                          <>
                            <button
                              onClick={() =>
                                updateOrder(order._id, "Completed")
                              }
                              className="btn-icon btn-complete"
                              title="Mark as Completed"
                            >
                              <CheckCircle />
                            </button>
                            <button
                              onClick={() =>
                                updateOrder(order._id, "Cancelled")
                              }
                              className="btn-icon btn-cancel"
                              title="Cancel Order"
                            >
                              <XCircle />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                )
              )
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No orders found.
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
