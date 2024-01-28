import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartPrice, setCartPrice] = useState(0);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    fetchCurrentUser(token);
  }, []);

  const fetchCurrentUser = (token) => {
    fetch("https://auth-six-pi.vercel.app/api/v1/auth/users/currentUser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserData(data.data.user);
      })
      .catch((error) => console.error("Error fetching current user:", error));
  };

  useEffect(() => {
    if (cartItems) {
      const itemTotal = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      setCartItemsCount(itemTotal);
    }
  }, [cartItemsCount]);

  const increaseQuantity = (item) => {
    const existingItem = cartItems.find(
      (cartItem) => cartItem.id === item.item_id
    );

    // Check if there are items in the cart from a different restaurant
    const isSameRestaurant = cartItems.every(
      (cartItem) => cartItem.restaurant_id === item.vendor_id
    );

    if (!isSameRestaurant) {
      const userWantsToReplace = window.confirm(
        "You can only add items from one restaurant at a time. Do you want to replace the current items in the cart?"
      );

      if (!userWantsToReplace) {
        return;
      }

      setCartItems([]);
      updateLocalStorage([]);

      const updatedCartItems = [
        {
          id: item.item_id,
          quantity: 1,
          restaurant_id: item.vendor_id,
          name: item.name,
        },
      ];
      setCartItems(updatedCartItems);
      updateLocalStorage(updatedCartItems);
    } else {
      if (existingItem) {
        const updatedCartItems = cartItems.map((cartItem) =>
          cartItem.id === item.item_id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        setCartItems(updatedCartItems);
        updateLocalStorage(updatedCartItems);
      } else {
        const updatedCartItems = [
          ...cartItems,
          {
            id: item.item_id,
            quantity: 1,
            restaurant_id: item.vendor_id,
            name: item.name,
          },
        ];
        setCartItems(updatedCartItems);
        updateLocalStorage(updatedCartItems);
      }
    }
  };

  const decreaseQuantity = (item) => {
    const existingItem = cartItems.find(
      (cartItem) => cartItem.id === item.item_id
    );

    if (existingItem) {
      const updatedCartItems = cartItems
        .map((cartItem) =>
          cartItem.id === item.item_id
            ? { ...cartItem, quantity: Math.max(cartItem.quantity - 1, 0) }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0);

      setCartItems(updatedCartItems);
      updateLocalStorage(updatedCartItems);
    }
  };

  const fetchTotalCartPrice = async () => {
    try {
      const cartItemsString = JSON.stringify(cartItems);

      const response = await axios.get(
        `https://inventory-service-git-main-swiftyeco.vercel.app/api/v1/inventory/customer/cartprice?vendor_id=${cartItems[0]["restaurant_id"]}&cartItems=${cartItemsString}`
      );
      setCartPrice(response.data.totalPrice);
    } catch (error) {
      console.error("Error fetching total cart price:", error);
    }
  };

  useEffect(() => {
    if (cartItems.length > 0) {
      fetchTotalCartPrice();
    }
  }, [cartItems]);

  const updateLocalStorage = (updatedCartItems) => {
    localStorage.setItem("cart", JSON.stringify(updatedCartItems));
  };

  const contextValue = {
    cartItems,
    cartPrice,
    cartItemsCount,
    userData,
    increaseQuantity,
    decreaseQuantity,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};
