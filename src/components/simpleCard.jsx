// import {
//   Card,
//   CardHeader,
//   CardBody,
//   Typography,
//   Button,
//   Chip
// } from "@material-tailwind/react";
 
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


import React, { useState } from 'react';

const MenuItem = ({ item, onAddToCart, onRemoveFromCart }) => {
  const [quantity, setQuantity] = useState(0);

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
    <div className="flex justify-between items-center p-4 border-b">
      <div>
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <p className="text-gray-500">{item.description}</p>
      </div>
      <div className="flex items-center">
        <button onClick={addToCart} className="bg-green-500 text-white px-4 py-2 mr-2">
          {quantity === 0 ? 'Add to Cart' : `+${quantity}`}
        </button>
        {quantity > 0 && (
          <button onClick={removeFromCart} className="bg-red-500 text-white px-2 py-1">
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuItem;