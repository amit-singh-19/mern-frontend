import React, { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import AppContext from "../context/AppContext";
import { toast } from "react-toastify";
import { Package, AlertCircle, CreditCard, Calendar, Hash } from "lucide-react";

export default function Order() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [error, setError] = useState();
  const [orders, setOrders] = useState([]);
  const { user } = useContext(AppContext);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const fetchOrders = async () => {
    try {
      const url = `${API_URL}/api/orders/${user.user.email}`;
      const result = await axios.get(url);
      // console.log(result);
      setOrders(result.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch orders");
      setError("Something went wrong");
    }
  };
  useEffect(() => {
    if (user && user.token && user.user && user.user.email) {
      fetchOrders();
    } else {
      setError("You must be logged in to view your orders.");
      toast.error("Please login to view your orders");
    }
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // return (
  //   <div>
  //     <h3>My Orders</h3>
  //     <p>{error}</p>
  //     {orders &&
  //       orders.map((order) => (
  //         <div>
  //           <p>OrderId:{order._id}</p>
  //           <p>Order Value: {order.orderValue} </p>
  //           <p>Status:{order.status}</p>
  //           <table border="1">
  //             <thead>
  //               <th>Product</th>
  //               <th>Price</th>
  //               <th>Quantity</th>
  //               <th>Total</th>
  //             </thead>
  //             {order.items.map((item) => (
  //               <tbody key={item._id}>
  //                 <tr>
  //                   <td>{item.productName}</td>
  //                   <td>{item.price}</td>
  //                   <td>{item.qty}</td>
  //                   <td>{item.qty * item.price}</td>
  //                 </tr>
  //               </tbody>
  //             ))}
  //           </table>
  //           <hr />
  //         </div>
  //       ))}
  //   </div>
  // );
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Package className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Orders Found
            </h3>
            <p className="text-gray-600">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">
                          Order #{order._id.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-lg text-gray-900">
                          {formatCurrency(order.orderValue)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Product
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">
                            Price
                          </th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">
                            Quantity
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, index) => (
                          <tr
                            key={item._id}
                            className={`${
                              index !== order.items.length - 1
                                ? "border-b border-gray-100"
                                : ""
                            } hover:bg-gray-50 transition-colors`}
                          >
                            <td className="py-4 px-4">
                              <div className="font-medium text-gray-900">
                                {item.productName}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right text-gray-700">
                              {formatCurrency(item.price)}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                                {item.qty}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right font-semibold text-gray-900">
                              {formatCurrency(item.qty * item.price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
