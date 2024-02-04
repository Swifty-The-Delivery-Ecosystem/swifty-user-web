import React, { useEffect, useState } from "react";
import MenuItem from "./simpleCard";

const MenuList = ({ vendor_id , searchText}) => {
  const [menuItems, setmenuItems] = useState();
  const [filteredMenuItems, setfilteredMenuItems] = useState();
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

  useEffect(() => {
    if (menuItems && searchText) {
      const filteredItems = menuItems.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setfilteredMenuItems(filteredItems);
    } else {
      setfilteredMenuItems(menuItems);
    }
  }, [menuItems, searchText, setfilteredMenuItems]);

  return (
    <div className="md:content-center min-h-screen md:mx-auto md:items-center">
      {filteredMenuItems && filteredMenuItems.map((item) => <MenuItem item={item} />)}
    </div>
  );
};

export default MenuList;
