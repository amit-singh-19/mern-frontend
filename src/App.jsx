import { useState } from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Register from "./components/Register.jsx";
import Product from "./components/Product.jsx";
import Cart from "./components/Cart.jsx";
import Login from "./components/Login.jsx";
import Order from "./components/Order.jsx";
import Orders from "./components/Orders.jsx";
import Admin from "./components/Admin.jsx";
import Users from "./components/Users.jsx";
import Products from "./components/Products.jsx";
import Navbar from "./components/Navbar.jsx";
import Profile from "./components/Profile.jsx"
import AppContext from "./context/AppContext.js";
import "./App.css";


function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState({});
  return (
    <div className="App-Container">
      <AppContext.Provider value={{ cart, setCart, user, setUser }}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route index element={<Product />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />            
            <Route path="profile" element={<Profile />} />            
            <Route path="cart" element={<Cart />} />
            <Route path="order" element={<Order />} />
            <Route path="admin" element={<Admin />}>
              <Route index element={<Users />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppContext.Provider>
    </div>
  );
}

export default App;
