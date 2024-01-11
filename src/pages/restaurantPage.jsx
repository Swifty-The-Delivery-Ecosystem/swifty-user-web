import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardHeader, CardBody } from "@material-tailwind/react";
import MenuList from "../components/menuList";
import CartSummary from "../components/cart_summary";
import { useCart } from "../context/cartcontext";
function RestaurantScreen() {
  const location = useLocation();

  const { cartItems } = useCart();

  const restaurant = location.state.restaurant;
  console.log(restaurant);

  return (
    <>
      <Card className="w-9/10 mx-12 py-9 my-10 content-start justify-between bg-purple-100">
        <CardBody> 
        <img className="w-1/5 rounded-md" src={restaurant.image_url} alt = {restaurant.name}/> 
        <CardHeader className="font-bold text-xl px-10 py-2 w-1/5">
          {restaurant.name}
        </CardHeader>
        </CardBody>

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
