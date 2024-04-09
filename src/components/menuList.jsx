import React, { useEffect, useState } from "react";
import MenuItem from "./simpleCard";

const MenuList = ({ vendor_id, searchText }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [isVeg, setIsVeg] = useState(false);
  const [sortOrder, setSortOrder] = useState("lowToHigh");
  const [ratingSortOrder, setRatingSortOrder] = useState("highToLow");

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

    if (ratingSortOrder === "lowToHigh") {
      filteredItems.sort((a, b) => a.rating - b.rating);
    } else if (ratingSortOrder === "highToLow") {
      filteredItems.sort((a, b) => b.rating - a.rating);
    }

    setFilteredMenuItems(filteredItems);
  }, [menuItems, searchText, isVeg, sortOrder, ratingSortOrder]);

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleRatingSortChange = (e) => {
    setRatingSortOrder(e.target.value);
  };

  return (
    <div className="mx-auto min-h-screen md:items-center">
      <div className="my-2 mx-auto">
        <button
          className={`mx-4 py-2 px-4 rounded-lg ${
            !isVeg
              ? "bg-black text-white"
              : "bg-white text-black border border-black"
          }`}
          onClick={() => setIsVeg(false)}
        >
          Veg
        </button>

        <button
          className={`mx-4 py-2 px-4 rounded-lg ${
            isVeg
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
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>

        <select
          value={ratingSortOrder}
          onChange={handleRatingSortChange}
          className="mx-4 py-2 px-4 rounded-lg bg-white text-black border border-black"
        >
          <option value="lowToHigh">Rating: Low to High</option>
          <option value="highToLow">Rating: High to Low</option>
        </select>
      </div>
      {filteredMenuItems.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default MenuList;
