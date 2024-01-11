import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardHeader, CardBody } from "@material-tailwind/react";
import MenuList from "../components/menuList";
import CartSummary from "../components/cart_summary";
import { useCart } from "../context/cartcontext";
import star from "../assets/images/star.png";

function RestaurantScreen() {
  const location = useLocation();

  const { cartItems } = useCart();

  const restaurant = location.state.restaurant;
  console.log(restaurant);

  return (
    <>
      <Card className="w-9/10 mx-12 py-9 my-10 content-start justify-between bg-purple-100">
        <div className="flex justify-start gap-6 px-8 py-4 items-start">
          <div>
            <img
              className="w-80 h-32 md:h-40"
              src={restaurant.image_url}
              alt=""
            />
          </div>
          <div className="flex flex-col">
            <div className="mt-6 md:text-xl py-2 text-lg font-bold">
              {restaurant.name}
            </div>
            <div className="flex py-2 gap-2">
              <img src={star} alt="" className="w-6 h-6" />{" "}
              {restaurant.rating.$numberDecimal.toString()}
            </div>
            <div className="md:text-lg text-sm font-medium">
              {restaurant.description}
            </div>
          </div>
        </div>
      </Card>
      <div className="">
        <div className="min-h-screen ">
          <MenuList menuItems={restaurant.items} />
        </div>

        <div className="bottom-0 sticky">
          {cartItems.length > 0 && <CartSummary className="bottom-0" />}
        </div>
      </div>
    </>
  );
}

export default RestaurantScreen;
