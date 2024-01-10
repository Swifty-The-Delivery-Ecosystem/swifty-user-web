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

  const fetchRestaurantDetails = async () => {
    try {
      if (cartItems) {
        const rid = String(cartItems[0]["restaurant_id"]);
        console.log("ohhhhh", rid);

        const response = await axios.get(
          `https://inventory-service-git-main-swiftyeco.vercel.app/api/customer/getdetails?restaurant_id=${rid}`
        );

        setdetails(response.data);
        console.log("bkl", response.data);
      }
    } catch (error) {
      console.error("Error fetching total cart price:", error);
    }
  };

  useEffect(() => {
    if (cartItems) {
      fetchRestaurantDetails();
    }
  }, [cartItems]);

  const contextValue = {
    details,
  };

  return (
    <RestaurantContext.Provider value={contextValue}>
      {children}
    </RestaurantContext.Provider>
  );
};
