import "./App.css";
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

function App() {
  return (
    <>
      <BrowserRouter>
        <Link to="/">Home</Link>-<Link to="/cart">MyCart</Link>-
        <Link to="/order">MyOrder</Link>-<Link to="/admin">Admin</Link>-
        <Link to="/login">Login</Link>
        <Routes>
          <Route index element={<Product />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="cart" element={<Cart />} />
          <Route path="order" element={<Order />} />
          <Route path="admin" element={<Admin />}>
            <Route index element={<Users />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
