
import React from 'react';
import MenuItem from './simpleCard';

const MenuList = ({ menuItems, onAddToCart, onRemoveFromCart , cartItems }) => {
  return (
    <div>
      {menuItems.map((item) => (
        <MenuItem
          key={item.id}  // Add a key prop for each item
          item={item}
          cartItems = {cartItems}
          onAddToCart={() => onAddToCart(item)}  // Pass the item to onAddToCart
          onRemoveFromCart={() => onRemoveFromCart(item.id)}  // Pass the itemId to onRemoveFromCart
        />
      ))}
    </div>
  );
};

export default MenuList;

