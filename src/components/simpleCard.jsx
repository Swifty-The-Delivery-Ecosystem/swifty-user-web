import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import { useCart } from "../context/cartcontext";
import ReactStars from "react-rating-stars-component";
import star from "../assets/images/star.png";

const MenuItem = ({ item }) => {
  const { cartItems, increaseQuantity, decreaseQuantity } = useCart();
  const [quantity, setQuantity] = useState(
    (cartItems &&
      cartItems.find((cartItem) => cartItem.id === item.item_id)?.quantity) ||
      0
  );

  useEffect(() => {
    if (cartItems) {
      const cartItem = cartItems.find(
        (cartItem) => cartItem.id === item.item_id
      );
      if (cartItem) {
        setQuantity(cartItem.quantity);
      } else {
        setQuantity(0);
      }
    }
  }, [item, cartItems]);

  if (!item.rating) {
    item.rating = 3;
  }

  return (
    <Card className="my-5 mx-10 shadow-none">
      <div className="md:grid grid-cols-3 text-center  justify-between items-center p-4 md:border-b">
        <div className="flex-shrink-0 mx-4 col-span-1/4">
          <img
            src={item.image_url}
            className="w-full h-[12rem] object-fill rounded-md"
            alt={item.name}
          />
        </div>
        <div className="flex-grow px-4 mx-4 text-start">
          <div className="flex gap-2">
            <img
              src={
                !item.is_veg
                  ? "https://i.pngimg.me/thumb/f/720/m2i8b1A0m2m2Z5Z5.jpg"
                  : "https://spng.pinpng.com/pngs/s/45-459786_non-veg-icon-circle-hd-png-download.png"
              }
              alt="type symbol"
              className="w-6 h-6"
            />
            <h3 className="text-lg font-semibold">{item.name}</h3>
          </div>
          <h3 className="text-lg font-medium">₹ {item.price}</h3>
          <div className="flex gap-2">
            <img src={star} className="w-6 h-6" />
            <h3 className="text-lg font-medium"> {item.rating}</h3>
          </div>

          <p className="text-gray-500 text-wrap text-sm">
            {item.description.length > 32
              ? `${item.description.slice(0, 28)}...`
              : item.description}
          </p>
        </div>
        <Card className="flex-shrink-0 w-fit text-center mx-auto bg-white rounded-md p-2">
          <div className="flex text-center items-center border-purple-500">
            {quantity !== 0 && (
              <>
                <button
                  onClick={() => {
                    decreaseQuantity(item);
                  }}
                  className="text-purple-500 text-center font-extrabold px-2"
                >
                  -
                </button>
                <div className="px-2 text-center text-purple-500 font-bold">
                  {quantity}
                </div>
              </>
            )}
            <button
              onClick={() => {
                increaseQuantity(item);
              }}
              className="text-purple-500 text-center font-bold px-2"
            >
              {quantity === 0 ? "Add to Cart" : `+`}
            </button>
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default MenuItem;
