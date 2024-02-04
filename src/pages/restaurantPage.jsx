import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MenuList from "../components/menuList";
import CartSummary from "../components/cart_summary";
import { useCart } from "../context/cartcontext";
import star from "../assets/images/star.png";

function RestaurantScreen() {
  const location = useLocation();
  const { cartItems } = useCart();
  const [searchText, setSearchText] = useState("");


  const restaurant = location.state.restaurant;

  return (
    <div className="md:content-center mx-1 md:mx-auto">
      <div className="flex bg-white mx-auto shadow-lg md:w-1/2 justify-between rounded-xl gap-6 px-8 py-4 items-start">
        <div>
          <img className="h-40 object-cover" src={restaurant.images[0]} alt="" />
        </div>
        <div className="flex flex-col">
          <div className="mt-6 md:text-xl py-2 text-lg font-bold">
            {restaurant.restaurantName}
          </div>
          <div className="flex items-center py-2 gap-2">
            <img src={star} alt="" className="w-6 h-6" /> {restaurant.ratings} |{" "}
            {restaurant.number_of_rating}+ ratings
          </div>
          <div className="md:text-lg text-sm font-medium">
            {restaurant.description}
          </div>
        </div>
      </div>

      <div className="md:content-center md:mx-auto">
      <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          name="Search"
          id="Search"
          class="bg-gray-50 w-[40%] my-4 mx-auto border hover:border-orange-500 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
          placeholder="Search"
          required=""
        />
        <div className="md:flex md:mx-auto md:justify-center md:flex-col">
          <MenuList searchText={searchText} vendor_id={restaurant._id} />
        </div>

        <div className="bottom-0 sticky">
          {cartItems.length > 0 && <CartSummary className="bottom-0" />}
        </div>
      </div>
    </div>
  );
}

export default RestaurantScreen;
