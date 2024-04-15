import React, { useEffect, useState } from "react";
import MenuItem from "./simpleCard";

const MenuList = ({ vendor_id, searchText }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [isVeg, setIsVeg] = useState(false);
  const [onOffer, setOnOffer] = useState(false);
  const [sortOrder, setSortOrder] = useState("lowToHigh");
  const [ratingSortOrder, setRatingSortOrder] = useState("highToLow");

  useEffect(() => {
    fetch(
      `https://inventory-service-mqul.onrender.com/api/v1/inventory/customer/vendors/${vendor_id}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMenuItems(data.items);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [vendor_id]);

  useEffect(() => {
    let filteredItems =
      menuItems &&
      menuItems.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    if (isVeg) {
      filteredItems =
        filteredItems && filteredItems.filter((item) => !item.is_veg);
    }
    if (onOffer) {
      filteredItems =
        filteredItems && filteredItems.filter((item) => item.on_offer);
    }
    if (sortOrder === "lowToHigh") {
      filteredItems &&
        filteredItems.sort((a, b) =>
          a.on_offer ? a.offer_price - b.offer_price : a.price - b.price
        );
    } else if (sortOrder === "highToLow") {
      filteredItems &&
        filteredItems.sort((a, b) =>
          b.on_offer ? b.offer_price - a.offer_price : b.price - a.price
        );
    }


    if (ratingSortOrder === "lowToHigh") {
      filteredItems && filteredItems.sort((a, b) => a.rating - b.rating);
    } else if (ratingSortOrder === "highToLow") {
      filteredItems && filteredItems.sort((a, b) => b.rating - a.rating);
    }

    setFilteredMenuItems(filteredItems);
  }, [menuItems, searchText, isVeg, sortOrder, ratingSortOrder, onOffer]);

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleRatingSortChange = (e) => {
    setRatingSortOrder(e.target.value);
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="my-2 mx-auto">
        <button
          className={`mx-4 py-2 px-4 rounded-lg ${
            isVeg
              ? "bg-black text-white"
              : "bg-white text-black border border-black"
          }`}
          onClick={() => setIsVeg(!isVeg)}
        >
          Pure Veg
        </button>
        <button
          className={`mx-4 py-2 px-4 rounded-lg ${
            onOffer
              ? "bg-black text-white"
              : "bg-white text-black border border-black"
          }`}
          onClick={() => setOnOffer(!onOffer)}
        >
          On Offer
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
      {filteredMenuItems &&
        filteredMenuItems.map((item) => <MenuItem key={item.id} item={item} />)}
    </div>
  );
};

export default MenuList;
