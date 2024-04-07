import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "./cartcontext";

const RestaurantContext = createContext();

export const useRestaurant = () => {
  return useContext(RestaurantContext);
};

export const RestaurantProvider = ({ children }) => {
  const { cartItems } = useCart();
  const [details, setdetails] = useState();
  const [restaurants, setRestaurants] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const contextValue = {
    details,
    restaurants,
    setRestaurants,
    recommendations,
    setRecommendations,
  };

  return (
    <RestaurantContext.Provider value={contextValue}>
      {children}
    </RestaurantContext.Provider>
  );
};
