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

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

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
        { id: item.item_id, quantity: 1, restaurant_id: item.restaurant_id },
      ];
      setCartItems(updatedCartItems);
      updateLocalStorage(updatedCartItems);
    }
  };

  const decreaseQuantity = (item) => {
    const updatedCartItems = cartItems
      .map((cartItem) =>
        cartItem.id === item.item_id
          ? { ...cartItem, quantity: Math.max(cartItem.quantity - 1, 0) }
          : cartItem
      )
      .filter((cartItem) => cartItem.quantity > 0);

    setCartItems(updatedCartItems);
    updateLocalStorage(updatedCartItems);
  };

  const fetchTotalCartPrice = async () => {
    try {
      const cartItemsString = JSON.stringify(cartItems);

      const response = await axios.get(
        `https://inventory-service-git-main-swiftyeco.vercel.app/api/customer/cartprice?restaurantID=${cartItems[0]["restaurant_id"]}&cartItems=${cartItemsString}`
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
    increaseQuantity,
    decreaseQuantity,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};
