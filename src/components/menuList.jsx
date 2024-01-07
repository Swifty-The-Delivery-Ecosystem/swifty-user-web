import React from "react";
import MenuItem from "./simpleCard";

const MenuList = ({ menuItems, onAddToCart, onRemoveFromCart , cartItems , restaurantId}) => {
  return (
    <div>
      {menuItems.map((item) => (
        <MenuItem
          item={item}
          onAddToCart={onAddToCart}
          onRemoveFromCart={onRemoveFromCart}
          cartItems={cartItems}
          restaurantId = {restaurantId}
        />
      ))}
    </div>
  );
};

export default MenuList;
