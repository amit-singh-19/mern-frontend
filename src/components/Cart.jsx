import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../App.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Cart() {
  const { user, cart, setCart } = useContext(AppContext);
  const [orderValue, setOrderValue] = useState(0);
  const [error, setError] = useState();
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

  useEffect(() => {
    setOrderValue(
      cart.reduce((sum, value) => {
        return sum + value.qty * value.price;
      }, 0)
    );
  }, [cart]);

  const placeOrder = async () => {
    try {
      const url = `${API_URL}/api/orders`;
      const newOrder = {
        userId: user.user.id,
        email: user.user.email,
        orderValue,
        items: cart,
      };
      console.log(newOrder)
      await axios.post(url, newOrder);
      setCart([]);
      Navigate("/order");
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    }
  };

  return (
    <div>
      <h2>My Cart</h2>
      <p>{error}</p>
      {cart &&
        cart.map(
          (value) =>
            value.qty > 0 && (
              <li key={value._id}>
                {value.productName} - ₹{value.price} -{" "}
                <button onClick={() => decrement(value._id, value.qty)}>
                  -
                </button>
                {value.qty}
                <button onClick={() => increment(value._id, value.qty)}>
                  +
                </button>
                -₹{value.price * value.qty}
              </li>
            )
        )}
      <h5>Order Value: ₹{orderValue} </h5>
      <p>
        {user?.token ? (
          <button onClick={placeOrder}>Place Order</button>
        ) : (
          <button onClick={() => Navigate("/login")}>Login to Order</button>
        )}
      </p>
    </div>
  );
}
