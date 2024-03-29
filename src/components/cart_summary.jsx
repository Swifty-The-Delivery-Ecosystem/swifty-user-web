import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/cartcontext";

function CartSummary() {
  const navigate = useNavigate();
  const { cartItems, cartPrice } = useCart();

  return (
    <div
      onClick={() => {
        navigate("/cart");
      }}
      className="text-center cursor-pointer px-6 items-center rounded-t-lg flex justify-between bg-green-400 text-white py-4 md:w-1/2 mx-auto bottom-0 sticky"
    >
      <div className="text-lg text-semibold">
        {cartItems.reduce((total, item) => total + item.quantity, 0)} Items | ₹{" "}
        {cartPrice}
      </div>
      <div className="flex font-semibold text-xl gap-4">
        View Cart{" "}
        <div>
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default CartSummary;
