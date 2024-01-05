import React from 'react';

const ShoppingCart = ({ cartItems, onRemoveFromCart }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id} className="flex justify-between items-center p-2 border-b">
            <span>{item.name}</span>
            <span>{item.quantity}</span>
            <button onClick={() => onRemoveFromCart(item.id)} className="text-red-500">
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingCart;