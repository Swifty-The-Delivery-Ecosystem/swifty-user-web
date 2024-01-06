import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Chip,
} from "@material-tailwind/react";
import { useEffect } from "react";

// export function HorizontalCard({item}) {
//   return (
//     <Card className="my-5 w-full  flex-row">
//       <CardHeader
//         shadow={false}
//         floated={false}
//         className="m-0 w-2/5 shrink-0 rounded-r-none"
//       >
//         <img
//           src={item.image_url}
//           alt="card-image"
//           className="h-full w-full object-cover"
//         />
//       </CardHeader>
//       <CardBody>
//       <Chip className="bg-white"></Chip>
//         <Typography variant="h6" color="gray" className="mb-4 uppercase">
//           {item.type ===0? "VEG": "NONVEG"}
//         </Typography>
//         <Typography variant="h4" color="blue-gray" className="mb-2">
//           {item.name}
//         </Typography>
//         <Typography color="gray" className="mb-8 font-normal">
//         ₹ {item.price}
//         </Typography>
//         <a href="#" className="inline-block">
//           <Button variant="text" className="flex items-center gap-2">
//             Add To Cart
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//               className="h-4 w-4"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
//               />
//             </svg>
//           </Button>
//         </a>
//       </CardBody>
//     </Card>
//   );
// }

import React, { useState } from "react";

const MenuItem = ({ item, onAddToCart, onRemoveFromCart, cartItems }) => {
  const [quantity, setQuantity] = useState(
    cartItems.find((cartItem) => cartItem.id === item.id)?.quantity || 0
  );
  useEffect(() => {
    // Check if the item is already in the cart and update the quantity
    const cartItem = cartItems.find((cartItem) => cartItem.id === item.id);
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [item, cartItems]);
  const addToCart = () => {
    setQuantity(quantity + 1);
    onAddToCart(item);
  };

  const removeFromCart = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
      onRemoveFromCart(item.id);
    }
  };

  return (
    <Card className="my-5 mx-10 shadow-none">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex justify-between items-center">
          <img
            src={item.image_url}
            className="w-40 rounded-md"
            alt={item.name}
          />
          <div className="items-center px-10">
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-gray-500 text-sm">{item.description}</p>
          </div>
        </div>
        <Card className="flex  justify-between items-center bg-white  rounded-md p-2">
          <div className="flex items-center border-purple-500">
            <button
              onClick={addToCart}
              className=" text-purple-500 font-bold px-2"
            >
              {quantity === 0 ? "Add to Cart" : `+`}
            </button>
            {quantity > 0 && (
              <>
                <div className="px-2 text-purple-500 font-bold">{quantity}</div>
                <button
                  onClick={removeFromCart}
                  className=" text-slate-200 font-bold px-2"
                >
                  -
                </button>
              </>
            )}
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default MenuItem;
