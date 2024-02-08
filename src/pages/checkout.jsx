import React, { useState, useEffect } from "react";
import star from "../assets/images/star.png";
import axios from "axios";
import { useCart } from "../context/cartcontext";
import { useRestaurant } from "../context/restaurant_details";
import { ShimmerSimpleGallery } from "react-shimmer-effects";
import Modal from "react-modal";
import { v4 as uuidv4 } from "uuid";
import { useSetlocation } from "../context/locationContext";

let amount;

function Checkout() {
  const { cartItems, cartPrice, userData, increaseQuantity, decreaseQuantity } =
    useCart();
  const { details } = useRestaurant();
  const [itemDetails, setItemDetails] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const orderId = uuidv4();

  async function createOrder({
    vendor_id,
    user_id,
    amount,
    cartItems,
    payment_method,
    user_location,
  }) {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8002/api/v1/order_service/user",
        {
          user_id: user_id,
          items: cartItems,
          amount: amount,
          vendor_id: vendor_id,
          order_instructions: "Please Send Cutlery",
          payment_method: payment_method,
          order_id: orderId,
          user_location: user_location,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        const result = response.data;
        if (payment_method === "cod") {
          localStorage.removeItem("cart");
          window.location.href = `http://localhost:3000/track?order_id=${orderId}`;
        }
        displayRazorpay(amount);
      } else {
        console.error("Error creating order:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  }

  async function displayRazorpay(totalAmount) {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    let data = JSON.stringify({
      amount: totalAmount * 100,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://payment-gateway-mocha.vercel.app/payment",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    let result;
    await axios.request(config).then((response) => {
      result = response;
    });

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    const { amount, id: order_id, currency } = result.data;

    const options = {
      key: process.env.RAZORPAY_KEY_ID,
      amount: (amount * 100).toString(),
      currency: currency,
      name: "Swifty.",
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
          "https://payment-gateway-mocha.vercel.app/payment/success",
          data
        );

        let redirect_url;

        if (
          typeof response.razorpay_payment_id == "undefined" ||
          response.razorpay_payment_id < 1
        ) {
          redirect_url = "/cart";
        } else {
          redirect_url = `/track?order_id=${orderId}`;
        }
        localStorage.removeItem("cart");
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
  const { selectedLocation } = useSetlocation();

  amount = (cartPrice + cartPrice * 0.05 + 5).toFixed(2);

  const handleCheckout = async () => {
    setModalIsOpen(true);
  };

  const handlePayment = async (method) => {
    setPaymentMethod(method);
    setModalIsOpen(false);

    if (method === "online") {
      createOrder({
        vendor_id: details._id,
        user_id: userData._id,
        amount: amount,
        cartItems: cartItems,
        payment_method: "online",
        user_location: selectedLocation.value,
      });
    } else {
      createOrder({
        vendor_id: details._id,
        user_id: userData._id,
        amount: amount,
        cartItems: cartItems,
        payment_method: "cod",
        user_location: selectedLocation.value,
      });
    }
  };

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const fetchItemDetails = async () => {
        try {
          const cartItemsString = JSON.stringify(cartItems);
          const response = await axios.get(
            `https://inventory-service-tau.vercel.app/api/customer/getitem?cartItems=${cartItemsString}`
          );
          setItemDetails(response.data["finalitems"]);
          console.log(response.data);
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
            <img
              className="w-80 object-cover h-32 md:h-40"
              src={details.images[0]}
              alt=""
            />
          </div>
          <div className="flex flex-col">
            <div className="mt-6 md:text-xl text-lg font-bold">
              {details.restaurantName}
            </div>
            <div className="flex gap-2">
              <img src={star} alt="" className="w-6 h-6" /> {details.ratings}
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
                  item.is_veg
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
      {details && userData && amount && cartItems && selectedLocation ? (
        <div>
          <div
            className="text-center bg-green-500 my-6 w-1/2 mx-auto py-3 text-white font-semibold text-xl hover:cursor-pointer hover:bg-green-600"
            onClick={handleCheckout}
          >
            CheckOut
          </div>
        </div>
      ) : (
        <div>
          <div className="text-center bg-green-300 my-6 w-1/2 mx-auto py-3 text-white font-semibold text-xl hover:cursor-pointer hover:bg-green-600">
            CheckOut
          </div>
        </div>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Payment Method"
        className="Modal rounded-md w-2/5 shadow-md p-6 bg-white mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        overlayClassName="Overlay fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="text-center">
          <p className="font-bold text-lg md:text-xl font-roboto">
            Please select a payment method:
          </p>
          <div className="mt-4">
            <button
              className="bg-blue-500 md:text-xl text-sm hover:bg-blue-600 px-2 text-white py-2 font-bold md:py-2 md:px-4 rounded md:mr-2"
              onClick={() => handlePayment("cod")}
            >
              Cash on Delivery (COD)
            </button>
            <button
              className="bg-green-500 md:text-xl text-sm my-2 py-2 hover:bg-green-600 text-white font-bold md:py-2 md:px-4 rounded"
              onClick={() => handlePayment("online")}
            >
              Online Payment
            </button>
          </div>
        </div>
      </Modal>
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
