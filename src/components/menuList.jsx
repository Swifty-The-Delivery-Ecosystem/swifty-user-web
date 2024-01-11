import React from "react";
import MenuItem from "./simpleCard";

const MenuList = ({ menuItems }) => {
  return (
    <div>
      {menuItems.map((item) => (
        <MenuItem item={item} />
      ))}
    </div>
  );
};

export default MenuList;
