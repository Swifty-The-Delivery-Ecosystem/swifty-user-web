import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MenuList from "../components/menuList";
import CartSummary from "../components/cart_summary";
import { useCart } from "../context/cartcontext";
import star from "../assets/images/star.png";

function RestaurantScreen() {
  const location = useLocation();
  const { cartItems } = useCart();

  const restaurant = location.state.restaurant;

  return (
    <div className="md:content-center mx-1 md:mx-auto">
      <div className="flex bg-white mx-auto shadow-lg md:w-1/2 justify-between rounded-xl gap-6 px-8 py-4 items-start">
        <div>
          <img className="h-40 object-cover" src={restaurant.image_url} alt="" />
        </div>
        <div className="flex flex-col">
          <div className="mt-6 md:text-xl py-2 text-lg font-bold">
            {restaurant.name}
          </div>
          <div className="flex items-center py-2 gap-2">
            <img src={star} alt="" className="w-6 h-6" /> {restaurant.rating} |{" "}
            {restaurant.number_of_ratings}+ ratings
          </div>
          <div className="md:text-lg text-sm font-medium">
            {restaurant.description}
          </div>
        </div>
      </div>

      <div className="md:content-center md:mx-auto">
        <div className="md:flex md:mx-auto md:justify-center md:flex-col">
          <MenuList vendor_id={restaurant._id} />
        </div>

        <div className="bottom-0 sticky">
          {cartItems.length > 0 && <CartSummary className="bottom-0" />}
        </div>
      </div>
    </div>
  );
}

export default RestaurantScreen;
