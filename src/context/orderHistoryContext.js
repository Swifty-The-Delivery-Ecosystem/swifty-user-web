import React, { createContext, useContext, useState, useEffect } from "react";
import { useProfile } from "./userContext";

const OrderHistory = createContext();

export const useOrderHistory = () => {
  return useContext(OrderHistory);
};

export const OrderHistoryProvider = ({ children }) => {
  const { userData, setUserData } = useProfile();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !userData) {
      return;
    }

    fetchOrders(userData._id);
  }, [userData]);

  const fetchOrders = (user_id) => {
    fetch(
      `https://order-service-peach.vercel.app/api/v1/order_service/users/${user_id}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(1);
        setOrders(data.orders);
      })
      .catch((error) => console.error("Error fetching current user:", error));
  };

  const contextValue = {
    orders,
  };

  return (
    <OrderHistory.Provider value={contextValue}>
      {children}
    </OrderHistory.Provider>
  );
};
