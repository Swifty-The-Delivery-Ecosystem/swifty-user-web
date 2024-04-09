import React, { useState, useEffect } from "react";
import trackimg from "../assets/images/deliverytrack.png";
import deliveryBoyImg from "../assets/images/deliveryBoyAvatar.png";

const DeliveryTrack = () => {
  const [items, setitems] = useState([]);
  const [cartPrice, setcartPrice] = useState(0);
  const [orderStatus, setOrderStatus] = useState("");
  const [deliveryBoyId, setDeliveryBoyId] = useState("");
  const [deliveryBoy, setDeliveryBoy] = useState({});
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const order_id = params.get("order_id");

  useEffect(() => {
    order_id &&
      fetch(
        `https://order-service-peach.vercel.app/api/v1/order_service/order?order_id=${order_id}`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
          // mode: "no-cors",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setitems(data.order.items);
          setcartPrice(data.order.amount);
          setOrderStatus(data.order.order_status);
          setDeliveryBoyId(data.order.delivery_boy_id);
        });
  }, [order_id]);

  useEffect(() => {
    deliveryBoyId &&
      fetch(
        `https://auth-git-tushar-patch-1-swiftyeco.vercel.app/api/v1/auth/delivery_partner/get_delivery_boy/${deliveryBoyId}`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
          // mode: "no-cors",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setDeliveryBoy(data.data.user);
        });
  }, [deliveryBoyId]);

  return (
    <div className="">
      <div class="md:flex text-center my-2 md:justify-center md:gap-8 md:px-8 md:w-1/2 mx-auto bg-gray-50 items-center">
        <img src={trackimg} alt="" className="md:mr-4 md:mx-1 mx-auto h-80" />

        <div className="md:text-start text-center">
          <div class="font-bold text-3xl font-roboto">Your Order is</div>
          <div class="font-medium text-2xl font-serif">
            {orderStatus === "" ? "Pending" : orderStatus}
          </div>
        </div>
      </div>
      <div className="mx-2">
        <div class="flex md:w-1/2 md:mx-auto px-4 shadow-xl bg-white rounded-xl md:px-16 py-4 justify-between items-center">
          <div class="mr-4">
            <div className="text-[1.25rem] font-roboto font-medium">
              Your Delivery Partner
            </div>
            <div className="text-[1rem] font-extrabold">
              {deliveryBoy && deliveryBoy.name}
            </div>
            <div className="text-[1rem] font-extrabold">
              {deliveryBoy && deliveryBoy.phone}
            </div>
            <div className="font-light mt-2 text-gray-800 text-sm">
              <span className="font-bold mr-1">100+</span>5-Star Deliveries
            </div>
          </div>
          <div>
            <img src={deliveryBoyImg} alt="" class="w-16 h-16 rounded-full" />
          </div>
        </div>
      </div>
      <div className="bg-white shadow-xl px-8 py-8 mt-2 rounded-xl md:w-1/2 mx-auto">
        <div className="">
          {items &&
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between mb-4"
              >
                <div className="text-lg font-bold">{item.name}</div>

                <div>x {item.quantity}</div>
              </div>
            ))}
        </div>
        <div className="flex my-2 justify-between">
          <div className="md:text-lg font-bold">Order Id</div>
          <div className="text-sm">{order_id}</div>
        </div>
        <div className="border-b-2 border-black">
          <div className="font-medium">Bill Details</div>
          <div className="border-b-2 px-4 ">
            <div className="flex mt-4 justify-between">
              <div className="font-extralight text-gray-600">Item Total</div>
              <div className="font-extralight text-gray-600">
                ₹ {cartPrice - (cartPrice * 0.05 + 5).toFixed(2)}
              </div>
            </div>
            <div className="flex mb-4 mt-4 justify-between">
              <div className="font-extralight text-gray-600">Delivery Fee</div>
              <div className="font-extralight text-gray-600">
                ₹{" "}
                {cartPrice === 0
                  ? 0
                  : (
                      (cartPrice -
                      (cartPrice * 0.05 + 5).toFixed(2)) * 0.05
                    ).toFixed(2)}
              </div>
            </div>
          </div>
          <div className="flex px-4 mb-4 mt-4 justify-between">
            <div className="font-extralight text-gray-600">Platform Fee</div>
            <div className="font-extralight text-gray-600">₹ 5</div>
          </div>
        </div>
        <div className="flex mb-4 mt-4 justify-between">
          <div className="font-bold text-xl ">Total Amount</div>
          <div className="font-bold text-xl">
            ₹ {cartPrice === 0 ? 0 : cartPrice}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTrack;
