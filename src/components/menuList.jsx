import React, { useEffect, useState } from "react";
import MenuItem from "./simpleCard";

const MenuList = ({ vendor_id, searchText }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [isVeg, setIsVeg] = useState(false);
  const [sortOrder, setSortOrder] = useState("lowToHigh");

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
        setMenuItems(data.items);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [vendor_id]);

  useEffect(() => {
    let filteredItems = menuItems.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    if (isVeg) {
      filteredItems = filteredItems.filter((item) => item.is_veg);
    }

    if (sortOrder === "lowToHigh") {
      filteredItems.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      filteredItems.sort((a, b) => b.price - a.price);
    }

    setFilteredMenuItems(filteredItems);
  }, [menuItems, searchText, isVeg, sortOrder]);

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  return (
    <div className="mx-auto min-h-screen md:items-center">
      <div className="my-2 mx-auto">
        <button
          className={`mx-4 py-2 px-4 rounded-lg ${
            isVeg
              ? "bg-black text-white"
              : "bg-white text-black border border-black"
          }`}
          onClick={() => setIsVeg(false)}
        >
          Veg
        </button>

        <button
          className={`mx-4 py-2 px-4 rounded-lg ${
            !isVeg
              ? "bg-black text-white"
              : "bg-white text-black border border-black"
          }`}
          onClick={() => setIsVeg(true)}
        >
          Non-Veg
        </button>
        <select
          value={sortOrder}
          onChange={handleSortChange}
          className="mx-4 py-2 px-4 rounded-lg bg-white text-black border border-black"
        >
          <option value="lowToHigh">Low to High</option>
          <option value="highToLow">High to Low</option>
        </select>
      </div>
      {filteredMenuItems.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default MenuList;
