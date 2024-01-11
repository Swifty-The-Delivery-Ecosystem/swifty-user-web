import React, { useState, useEffect } from "react";
import star from "../assets/images/star.png";
import axios from "axios";
import { useCart } from "../context/cartcontext";
import { useRestaurant } from "../context/restaurant_details";
import { ShimmerSimpleGallery } from "react-shimmer-effects";

async function displayRazorpay(cartprice) {
  let userData = null;

  const fetchCurrentUser = (token) => {
    fetch("https://auth-six-pi.vercel.app/api/userAuth/currentUser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Current User:", data.data.user);
        userData = data.data.user;
      })
      .catch((error) => console.error("Error fetching current user:", error));
  };

  const token = localStorage.getItem("token");
  console.log(token);

  fetchCurrentUser(token);

  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  // creating a new order
  let data = JSON.stringify({
    amount: cartprice,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/payment",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  let result;
  await axios.request(config).then((response) => {
    result = response;
    console.log(JSON.stringify(response.data));
  });

  // const result = await axios.post("http://127.0.0.1:8000/payment", JSON.stringify({
  //   "amount": 1
  // }));
  console.log(result);

  if (!result) {
    alert("Server error. Are you online?");
    return;
  }

  // Getting the order details back
  const { amount, id: order_id, currency } = result.data;
  console.log(result.data);

  const options = {
    key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
    amount: amount.toString(),
    currency: currency,
    name: "Swifty.",
    description: "Test Transaction",
    order_id: order_id,
    // callback_url:"http://localhost:3000/",
    // redirect: true,
    handler: async function (response) {
      console.log(response);
      const data = {
        orderCreationId: order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
      };
      console.log(data);

      const result = await axios.post(
        "http://localhost:8000/payment/success",
        data
      );

      let redirect_url;

      if (
        typeof response.razorpay_payment_id == "undefined" ||
        response.razorpay_payment_id < 1
      ) {
        redirect_url = "/";
      } else {
        redirect_url = "/";
      }
      window.location.href = redirect_url;
    },
    prefill: {
      name: "Aditya Dubey",
      email: "adityavinay@iitbhilai.ac.in",
      contact: "9892728762",
    },
    notes: {
      address: "IIT Bhilai",
    },
    theme: {
      color: "#ba68c8",
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
  const { cartItems, cartPrice, increaseQuantity, decreaseQuantity } =
    useCart();
  const { details } = useRestaurant();

  const [itemDetails, setItemDetails] = useState([]);

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const fetchItemDetails = async () => {
        try {
          const cartItemsString = JSON.stringify(cartItems);
          const response = await axios.get(
            `https://inventory-service-git-main-swiftyeco.vercel.app/api/customer/getitem?cartItems=${cartItemsString}`
          );
          setItemDetails(response.data["finalitems"]);
        } catch (error) {
          console.error("Error fetching item details:", error);
        }
      };

      fetchItemDetails();
    }
  }, [cartItems]);
  const { cartprice } = useCart();
  return cartItems.length > 0 ? (
    <div className="mx-auto bg-white py-6 md:w-1/2 shadow-lg my-4">
      {details ? (
        <div className="flex justify-start gap-6 px-8 py-4 items-start">
          <div>
            <img className="w-80 h-32 md:h-40" src={details.image_url} alt="" />
          </div>
          <div className="flex flex-col">
            <div className="mt-6 md:text-xl text-lg font-bold">
              {details.name}
            </div>
            <div className="flex gap-2">
              <img src={star} alt="" className="w-6 h-6" />{" "}
              {details.rating.$numberDecimal.toString()}
            </div>
            <div className="md:text-lg text-sm font-medium">
              {details.description}
            </div>
          </div>
        </div>
      ) : (
        <ShimmerSimpleGallery row={1} col={1} card imageHeight={200} caption />
      )}

      <div className="px-8 py-4">
        {itemDetails.map((item) => (
          <div key={item.id} className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <img
                src={
                  item.type === 2
                    ? "https://i.pngimg.me/thumb/f/720/m2i8b1A0m2m2Z5Z5.jpg"
                    : "https://spng.pinpng.com/pngs/s/45-459786_non-veg-icon-circle-hd-png-download.png"
                }
                alt="type symbol"
                className="w-6 h-6"
              />
              <div className="text-lg font-bold">{item.name}</div>
            </div>
            <div className="flex items-center gap-8">
              <div className="border text-green-400 p-2 rounded-md">
                <button className="pr-4" onClick={() => decreaseQuantity(item)}>
                  -
                </button>

                {cartItems.find((cartItem) => cartItem.id === item.item_id)
                  ?.quantity || 0}
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
            <div className="font-extralight text-gray-600">₹ {cartPrice}</div>
          </div>
          <div className="flex mb-4 mt-4 justify-between">
            <div className="font-extralight text-gray-600">Delivery Fee</div>
            <div className="font-extralight text-gray-600">
              ₹ {(cartPrice * 0.05).toFixed(2)}
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
          ₹ {(cartPrice + cartPrice * 0.05 + 5).toFixed(2)}
        </div>
      </div>
      <div
        className="text-center bg-green-500 my-6 w-1/2 mx-auto py-3 text-white font-semibold text-xl hover:cursor-pointer hover:bg-green-600"
        onClick={() =>
          displayRazorpay((cartPrice + cartPrice * 0.05 + 5).toFixed(2) * 100)
        }
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
