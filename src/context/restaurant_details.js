import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "./cartcontext";
import { useSetlocation } from "./locationContext";

const RestaurantContext = createContext();

export const useRestaurant = () => {
  return useContext(RestaurantContext);
};

export const RestaurantProvider = ({ children }) => {
  const { cartItems } = useCart();
  const selectedLocation = useSetlocation();
  const [details, setdetails] = useState();
  const [restaurants, setRestaurants] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const fetchRestaurantDetails = async () => {
    try {
      if (cartItems) {
        const rid = String(cartItems[0]["restaurant_id"]);

        const response = await axios.get(
          `https://inventory-service-git-main-swiftyeco.vercel.app/api/v1/inventory/customer/vendors/details/${rid}`
        );

        setdetails(response.data);
      }
    } catch (error) {
      console.error("Error fetching total cart price:", error);
    }
  };

  const fetchRestaurant = async (loc) => {
    try {
      fetch(
        `https://inventory-service-git-main-swiftyeco.vercel.app/api/v1/inventory/customer/vendors?primary_location=${loc}`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          // Repeat the restaurants 10 times
          const repeatedRestaurants = Array.from(
            { length: 4 },
            () => data
          ).flat();
          setRestaurants(repeatedRestaurants);
        })
        .catch((error) => console.error("Error fetching data:", error));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (cartItems) {
      fetchRestaurantDetails();
    }
  }, [cartItems]);

  const contextValue = {
    details,
    restaurants,
    setRestaurants,
    recommendations,
    setRecommendations,
    fetchRestaurant,
  };
  return (
    <RestaurantContext.Provider value={contextValue}>
      {children}
    </RestaurantContext.Provider>
  );
};
