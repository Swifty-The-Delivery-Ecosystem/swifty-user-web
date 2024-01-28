import React, { useEffect, useState } from "react";
import MenuItem from "./simpleCard";

const MenuList = ({ vendor_id }) => {
  const [menuItems, setmenuItems] = useState();
  useEffect(() => {
    fetch(
      `https://inventory-service-git-main-swiftyeco.vercel.app/api/v1/inventory/customer/vendors/${vendor_id}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setmenuItems(data.items);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [menuItems]);

  return (
    <div className="md:content-center min-h-screen md:mx-auto md:items-center">
      {menuItems && menuItems.map((item) => <MenuItem item={item} />)}
    </div>
  );
};

export default MenuList;
