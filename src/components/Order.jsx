import React, { useState } from 'react'
import axios from 'axios'
import { useContext } from 'react';
import { AppContext } from '../App';

export default function Order() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [error, setError] = useState();
  const {user} = useContext(AppContext);
  const fetchOrders = async (params) => {
    try {
      const [orders, setOrders] = useState([]);
    const url = `${API_URL}/api/orders/${user._id}`
    const result = axios.get(url);
    } catch (error) {
      console.log(error);
      setError ("Something went wrong");     
    }
  }
  return (
    <div>Order</div>
  )
}
