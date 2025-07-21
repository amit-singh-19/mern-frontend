import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AppContext from "../context/AppContext";
import "./Product.css";

export default function Product() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [products, setProducts] = useState([]);
  const [error, setError] = useState();
  const { user, cart, setCart } = useContext(AppContext);

  const fetchProducts = async () => {
    try {
      const url = `${API_URL}/api/products/all`;
      const result = await axios.get(url);
      // console.log(result);
      setProducts(result.data.products);
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const found = cart.find((item) => item._id === product._id);
    if (!found) {
      product.qty = 1;
      setCart([...cart, product]);
      // console.log(cart);
    }
  };

  return (
    <div className="product-grid">
      {products &&
        products.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-image">
              <img src={product.imgUrl} alt="img" width="200" />
            </div>
            <div className="product-name">
              <h3>{product.productName}</h3>
            </div>
            <div className="product-description">
              <p>{product.description}</p>
            </div>
            <div className="product-footer">
              <span className="product-price">₹{product.price}</span>
              <button
                onClick={() => {
                  addToCart(product);
                }}
                className="add-to-cart"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
