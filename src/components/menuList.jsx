import React from "react";
import MenuItem from "./simpleCard";

const MenuList = ({
  menuItems,
  // onAddToCart,
  // onRemoveFromCart,
  // cartItems,
  // rid,
}) => {
  // const rid = cartItems[0]["restaurant_id"];
  // console.log(rid);
  return (
    <div>
      {menuItems.map((item) => (
        <MenuItem
          item={item}
          // onAddToCart={onAddToCart}
          // onRemoveFromCart={onRemoveFromCart}
          // cartItems={cartItems}
          // rid={rid}
        />
      ))}
    </div>
  );
};

export default MenuList;
