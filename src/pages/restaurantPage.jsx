import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@material-tailwind/react";
import MenuList from "../components/menuList";
import CartSummary from "../components/cart_summary";

function RestaurantScreen() {
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const updateLocalStorage = (updatedCartItems) => {
    localStorage.setItem("cart", JSON.stringify(updatedCartItems));
  };

  const addToCart = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.item_id);

    if (existingItem) {
      const updatedCartItems = cartItems.map((cartItem) =>
        cartItem.id === item.item_id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      setCartItems(updatedCartItems);
      updateLocalStorage(updatedCartItems);
    } else {
      const updatedCartItems = [...cartItems, { id: item.item_id, quantity: 1 }];
      setCartItems(updatedCartItems);
      updateLocalStorage(updatedCartItems);
    }
  };

  const removeFromCart = (itemId) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(0, item.quantity - 1) }
        : item
    );

    const filteredCartItems = updatedCartItems.filter(
      (item) => item.quantity > 0
    );

    setCartItems(filteredCartItems);
    updateLocalStorage(filteredCartItems);
  };

  const restaurant = location.state.restaurant;

  return (
    <>
      <Card className="w-9/10 mx-12 py-9 my-10 content-start justify-between bg-purple-100">
        <CardHeader className="font-bold text-xl px-10 py-2 w-max">
          {restaurant.name}
        </CardHeader>
        <CardBody></CardBody>
        <CardFooter></CardFooter>
      </Card>
      <div className="">
        <div className="min-h-screen ">
          <MenuList
            menuItems={restaurant.items}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            cartItems={cartItems}
            restaurantId = {restaurant._id}
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
    </>
  );
}

export default RestaurantScreen;
