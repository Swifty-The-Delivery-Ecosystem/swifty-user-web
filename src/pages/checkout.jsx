import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import star from "../assets/images/star.png";
import axios from "axios";

async function displayRazorpay() {
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  // creating a new order
  const result = await axios.post("http://localhost:5000/payment/orders");

  if (!result) {
    alert("Server error. Are you online?");
    return;
  }

  // Getting the order details back
  const { amount, id: order_id, currency } = result.data;

  const options = {
    key: "rzp_test_r6FiJfddJh76SI", // Enter the Key ID generated from the Dashboard
    amount: amount.toString(),
    currency: currency,
    name: "Soumya Corp.",
    description: "Test Transaction",
    order_id: order_id,
    handler: async function (response) {
      const data = {
        orderCreationId: order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
      };

      const result = await axios.post(
        "http://localhost:5000/payment/success",
        data
      );

      alert(result.data.msg);
    },
    prefill: {
      name: "Soumya Dey",
      email: "SoumyaDey@example.com",
      contact: "9999999999",
    },
    notes: {
      address: "Soumya Dey Corporate Office",
    },
    theme: {
      color: "#61dafb",
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
}

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

function Checkout() {
  const location = useLocation();
  const { restaurant, cartItems } = location.state;
  const [cart, setCart] = useState(cartItems);
  const [itemDetails, setItemDetails] = useState([]);
  const [totalCartPrice, setTotalCartPrice] = useState(0);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const itemIds = cart.map((item) => item.id);
        const response = await axios.get(
          `http://localhost:4005/api/customer/getitem?itemIds=${itemIds.join(
            ","
          )}`
        );
        setItemDetails(response.data);
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    };

    fetchItemDetails();
  }, [cart]);
  useEffect(() => {
    const fetchTotalCartPrice = async () => {
      try {
        const response = await axios.post(
          "http://localhost:4005/api/customer/cartprice",
          {
            restaurantID: restaurant._id, // Assuming you have the restaurant ID
            cartItems: cart.map((item) => item.id),
          }
        );

        setTotalCartPrice(response.data.totalPrice);
      } catch (error) {
        console.error("Error fetching total cart price:", error);
      }
    };

    fetchTotalCartPrice();
  }, [restaurant, cart]);
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
          <img
            className="w-40 h-32 md:h-40"
            src={restaurant.image_url}
            alt=""
          />
        </div>
        <div className="flex flex-col">
          <div className="mt-6 md:text-xl text-lg font-bold">
            {restaurant.name}
          </div>
          <div className="flex gap-2">
            <img src={star} alt="" className="w-6 h-6" />{" "}
            {restaurant.rating.$numberDecimal.toString()}
          </div>
          <div className="md:text-lg text-sm font-medium">
            {restaurant.description}
          </div>
        </div>
      </div>

      <div className="px-8 py-4">
        {itemDetails.map((item) => (
          <div key={item.id} className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <img
                src={item.type === 0 ? "veg-image-url" : "non-veg-image-url"}
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
      <div
        className="text-center bg-green-500 my-6 w-1/2 mx-auto py-3 text-white font-semibold text-xl hover:cursor-pointer hover:bg-green-600"
        onClick={displayRazorpay}
      >
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
      <div className="text-xl text-gray-500">
        You can go to home page to view more restaurants
      </div>
    </div>
  );
}

export default Checkout;
