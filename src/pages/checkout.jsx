import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import star from "../assets/images/star.png";

function Checkout() {
  const location = useLocation();
  const { restaurant, cartItems } = location.state;
  const [cart, setCart] = useState(cartItems);

  const increaseQuantity = (item) => {
    const updatedCartItems = cart.map((cartItem) =>
      cartItem.id === item.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
    setCart(updatedCartItems);
  };

  const decreaseQuantity = (item) => {
    const updatedCartItems = cart
      .map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: Math.max(cartItem.quantity - 1, 0) }
          : cartItem
      )
      .filter((cartItem) => cartItem.quantity > 0);

    setCart(updatedCartItems);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  return cart.length > 0 ? (
    <div className="mx-auto bg-white py-6 md:w-1/2 shadow-lg my-4">
      <div className="flex justify-start gap-6 px-8 py-4 items-start">
        <div>
          <img className="w-40 h-32 md:h-40" src={restaurant.image_url} alt="" />
        </div>
        <div className="flex flex-col">
          <div className="mt-6 md:text-xl text-lg font-bold">{restaurant.name}</div>
          <div className="flex gap-2">
            <img src={star} alt="" className="w-6 h-6" />{" "}
            {restaurant.rating.$numberDecimal.toString()}
          </div>
          <div className="md:text-lg text-sm font-medium">{restaurant.description}</div>
        </div>
      </div>

      <div className="px-8 py-4">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <img
                src={
                  item.type === 0
                    ? "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Veg_symbol.svg/180px-Veg_symbol.svg.png?20131205102827"
                    : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Non_veg_symbol.svg/2048px-Non_veg_symbol.svg.png"
                }
                alt={item.isVegetarian ? "Vegetarian" : "Non-Vegetarian"}
                className="w-6 h-6"
              />
              <div className="text-lg font-bold">{item.name}</div>
            </div>
            <div className="flex items-center gap-8">
              <div className="border text-green-400 p-2 rounded-md">
                <button className="pr-4" onClick={() => decreaseQuantity(item)}>
                  -
                </button>

                {item.quantity}
                <button className="pl-4" onClick={() => increaseQuantity(item)}>
                  +
                </button>
              </div>
              <div>₹ {item.price}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-b-2 border-black mx-8">
        <div className="font-medium">Bill Details</div>
        <div className="border-b-2 px-4 ">
          <div className="flex mt-4 justify-between">
            <div className="font-extralight text-gray-600">Item Total</div>
            <div className="font-extralight text-gray-600">
              ₹ {getTotalPrice()}
            </div>
          </div>
          <div className="flex mb-4 mt-4 justify-between">
            <div className="font-extralight text-gray-600">Delivery Fee</div>
            <div className="font-extralight text-gray-600">
              ₹ {(getTotalPrice() * 0.05).toFixed(2)}
            </div>
          </div>
        </div>
        <div className="flex px-4 mb-4 mt-4 justify-between">
          <div className="font-extralight text-gray-600">Platform Fee</div>
          <div className="font-extralight text-gray-600">₹ 5</div>
        </div>
      </div>
      <div className="flex px-8 mb-4 mt-4 justify-between">
        <div className="font-bold text-xl ">To Pay</div>
        <div className="font-bold text-xl">
          ₹ {(getTotalPrice() + getTotalPrice() * 0.05 + 5).toFixed(2)}
        </div>
      </div>
      <div className="text-center bg-green-500 my-6 w-1/2 mx-auto py-3 text-white font-semibold text-xl hover:cursor-pointer hover:bg-green-600">
        CheckOut
      </div>
    </div>
  ) : (
    <div className="mx-auto items-center text-center bg-white py-12 px-4 md:w-1/2 shadow-lg my-4">
      <div>
        <img
          className="w-100 mx-auto"
          src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/2xempty_cart_yfxml0"
          alt=""
        />
      </div>
      <div className="text-2xl my-5 font-bold">Your cart is empty</div>
      <div className="text-xl text-gray-500">You can go to home page to view more restaurants</div>
    </div>
  );
}

export default Checkout;
