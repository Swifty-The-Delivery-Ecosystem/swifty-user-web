
import React from 'react';
import SimpleCard, { HorizontalCard } from '../components/simpleCard';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import MenuList from '../components/menuList';
import ShoppingCart from '../components/shoppingCart';



function RestaurantScreen(){
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      const updatedCartItems = cartItems.map((cartItem) =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      );
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
    );

    setCartItems(updatedCartItems.filter((item) => item.quantity > 0));
  };

  const restaurant = location.state.restaurant;
  return <>
  <MenuList menuItems={restaurant.items} onAddToCart={addToCart} onRemoveFromCart={removeFromCart} />
 
  <ShoppingCart cartItems={cartItems} />
  </>

}

export default RestaurantScreen;