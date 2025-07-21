import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AppContext from "../context/AppContext";
import "./Product.css";
import { toast } from "react-toastify";

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
      toast.error("Failed to load products");
      setError("Something went wrong");
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const found = cart.find((item) => item._id === product._id);
    if (!found) {
      const newProduct = { ...product, qty: 1 };
      setCart([...cart, newProduct]);
      toast.success("Added to cart!");
    } else {
      const updatedCart = cart.map((item) =>
        item._id === product._id ? { ...item, qty: item.qty + 1 } : item
      );
      setCart(updatedCart);
      toast.info("Increased quantity in cart");
    }
  };

  return (
    <div className="product-container">
      <div className="product-title">
        <h1>Our Products</h1>
      </div>
      <div className="product-grid">
        {products &&
          products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="home-product-image">
                <img src={product.imgUrl} alt="img"  />
              </div>
              <div className="product-content">
                <div className="product-name">
                  <h3>{product.productName}</h3>
                </div>
                <div className="product-rating">
                  <div className="stars">
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">☆</span>
                  </div>
                  <span className="rating-text">4.5 (128 reviews)</span>
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
            </div>
          ))}
      </div>
    </div>
  );
}
