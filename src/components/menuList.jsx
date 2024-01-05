
import React from 'react';
import MenuItem from './simpleCard';

const MenuList = ({ menuItems, onAddToCart, onRemoveFromCart }) => {

  return (
    <div>
      {menuItems.map((item) => (
        <MenuItem  item={item} onAddToCart={onAddToCart} onRemoveFromCart={onRemoveFromCart} />
      ))}
    </div>
  );
};

export default MenuList;
