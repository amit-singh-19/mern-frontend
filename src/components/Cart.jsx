import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  CreditCard,
  User,
} from "lucide-react";

export default function Cart() {
  const { user, cart, setCart } = useContext(AppContext);
  const [orderValue, setOrderValue] = useState(0);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const Navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const increment = (id, qty) => {
    const updatedCart = cart.map((product) =>
      product._id === id ? { ...product, qty: qty + 1 } : product
    );
    setCart(updatedCart);
  };

  const decrement = (id, qty) => {
    const updatedCart = cart.map((product) =>
      product._id === id ? { ...product, qty: qty - 1 } : product
    );
    setCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((product) => product._id !== id);
    setCart(updatedCart);
    toast.info("Item removed from cart");
  };

  const clearCart = () => {
    setCart([]);
    toast.info("Cart cleared");
  };

  useEffect(() => {
    setOrderValue(
      cart.reduce((sum, value) => {
        return sum + value.qty * value.price;
      }, 0)
    );
  }, [cart]);

  const placeOrder = async () => {
    setIsLoading(true);
    try {
      const url = `${API_URL}/api/orders`;
      const newOrder = {
        userId: user.user.id,
        email: user.user.email,
        orderValue,
        items: cart,
      };
      console.log(newOrder);
      await axios.post(url, newOrder);
      setCart([]);
      toast.success("Order placed successfully!");
      Navigate("/order");
    } catch (error) {
      console.log(error);
      toast.error("Failed to place order");
      setError("Something went wrong");
      setIsLoading(false);
    }
  };

  const goBack = () => {
    Navigate(-1);
  };

  const goToLogin = () => {
    Navigate("/login");
  };

  const continueShopping = () => {
    Navigate("/");
  };

  const cartItems = cart.filter((item) => item.qty > 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={goBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">My Cart</h1>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {totalItems} items
              </span>
            </div>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500 mb-8">Add some items to get started</p>
            <button
              onClick={continueShopping}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Cart Items
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {item.productName}
                          </h3>
                          <p className="text-gray-600">₹{item.price} each</p>
                        </div>

                        <div className="flex items-center space-x-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg">
                            <button
                              onClick={() => decrement(item._id, item.qty)}
                              disabled={item.qty <= 1}
                              className="p-2 hover:bg-gray-200 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 font-medium text-gray-900 min-w-[3rem] text-center">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => increment(item._id, item.qty)}
                              className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Item Total */}
                          <div className="text-right min-w-[5rem]">
                            <p className="text-lg font-semibold text-gray-900">
                              ₹{(item.price * item.qty).toLocaleString()}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item._id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-8">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Order Summary
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Items ({totalItems})</span>
                    <span>₹{orderValue.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className="text-green-600">Free</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>₹{orderValue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  {user?.token ? (
                    <button
                      onClick={placeOrder}
                      disabled={isLoading || cartItems.length === 0}
                      className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Placing Order...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          <span>Place Order</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={goToLogin}
                      className="w-full bg-gray-600 text-white py-4 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <User className="w-5 h-5" />
                      <span>Login to Order</span>
                    </button>
                  )}

                  <button
                    onClick={continueShopping}
                    className="w-full mt-3 bg-white text-gray-700 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
