import React from "react";
import SimpleCard, { HorizontalCard } from "../components/simpleCard";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import MenuList from "../components/menuList";
import ShoppingCart from "../components/shoppingCart";
import CartSummary from "../components/cart_summary";

function RestaurantScreen() {
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      const updatedCartItems = cartItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(0, item.quantity - 1) }
        : item
    );

    setCartItems(updatedCartItems.filter((item) => item.quantity > 0));
  };

  const restaurant = location.state.restaurant;
  return (
    <div className="">
      <div className="min-h-screen ">
        <MenuList
          menuItems={restaurant.items}
          onAddToCart={addToCart}
          onRemoveFromCart={removeFromCart}
        />
      </div>

      <div className="bottom-0 sticky">
        {cartItems.length > 0 && (
          <CartSummary
            className="bottom-0"
            restaurant={restaurant}
            cartItems={cartItems}
          />
        )}
      </div>
    </div>
  );
}

export default RestaurantScreen;
