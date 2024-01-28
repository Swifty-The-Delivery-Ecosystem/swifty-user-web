import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import { useCart } from "../context/cartcontext";

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
      }
    }
  }, [item, cartItems]);

  return (
    <Card className="my-5 mx-10 shadow-none">
      <div className="md:flex justify-between items-center p-4 md:border-b">
        <div className="flex-shrink-0 mx-4">
          <img
            src={item.image_url}
            className="w-full h-40 rounded-md"
            alt={item.name}
          />
        </div>
        <div className="flex-grow px-4 mx-4 text-start">
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-gray-500 text-wrap text-sm">{item.description}</p>
        </div>
        <Card className="flex-shrink-0 text-center bg-white rounded-md p-2">
          <div className="flex text-center items-center border-purple-500">
            {quantity !== 0 && (
              <>
                <button
                  onClick={() => {
                    decreaseQuantity(item);
                  }}
                  className="text-slate-200 text-center font-bold px-2"
                >
                  -
                </button>
                <div className="px-2 text-center text-purple-500 font-bold">{quantity}</div>
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
