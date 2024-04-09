import React, { useState, useEffect } from "react";
import { useOrderHistory } from "../context/orderHistoryContext";
import { ShimmerSimpleGallery } from "react-shimmer-effects";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const OrderHistory = () => {
  const orders = useOrderHistory();
  const locations = [
    { label: "Kanhar", value: 1 },
    { label: "Indravati", value: 2 },
    { label: "MSH", value: 3 },
    { label: "Mess Block", value: 4 },
    { label: "Delta", value: 5 },
  ];
  const [ratings, setRatings] = useState({});
  const [ratingsSubmitted, setRatingsSubmitted] = useState({});

  const handleRestaurantRatingChange = (orderId, rating) => {
    if (ratingsSubmitted[orderId]) return;

    setRatings((prevRatings) => ({
      ...prevRatings,
      [orderId]: { ...prevRatings[orderId], res_rating: rating },
    }));
    submitRestaurantRating(orderId, rating);
  };

  const handleItemRatingChange = (orderId, itemId, rating) => {
    const key = `${orderId}_${itemId}`; // Unique key for each item within an order
    if (ratingsSubmitted[key]) return;

    setRatings((prevRatings) => ({
      ...prevRatings,
      [orderId]: { ...prevRatings[orderId], [itemId]: rating },
    }));

    submitItemRating(orderId, itemId, rating);
  };

  const submitRestaurantRating = async (orderId, rating) => {
    try {
      const response = await fetch(
        "https://rating-service.onrender.com/api/v1/rate/order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: orderId,
            rating: rating,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit restaurant rating");
      }

      toast.success("Restaurant rating submitted successfully");
      setRatingsSubmitted((prevSubmitted) => ({
        ...prevSubmitted,
        [orderId]: true,
      }));
    } catch (error) {
      console.error("Error submitting restaurant rating:", error);
      toast.error("Error submitting restaurant rating");
    }
  };

  const submitItemRating = async (orderId, itemId, rating) => {
    const key = `${orderId}_${itemId}`; // Unique key for each item within an order
    try {
      const response = await fetch(
        "https://rating-service.onrender.com/api/v1/rate/orderItem",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: orderId,
            item_id: itemId,
            rating: rating,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to submit item rating");
      }
      toast.success("Item rating submitted successfully");
      setRatingsSubmitted((prevSubmitted) => ({
        ...prevSubmitted,
        [key]: true,
      }));
    } catch (error) {
      console.error("Error submitting item rating:", error);
      toast.error("Error submitting rating");
    }
  };

  return (
    <div>
      <ToastContainer />
      <div>
        {orders.orders.length !== 0 ? (
          orders.orders.map((order) => {
            const createdAtDate = new Date(order.createdAt);
            const formattedDate = createdAtDate.toLocaleString("en-GB", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            });

            return (
              <div
                key={order.order_id}
                className="bg-white md:w-[40%] md:mx-auto my-4 mx-2 items-center shadow-xl"
              >
                <a href={`/track?order_id=${order.order_id}`}>
                  <div className="flex py-4 px-4 md:py-8 md:px-12 items-center gap-2 md:justify-evenly md:gap-6">
                    <img
                      src={order.vendor_image}
                      alt={order.vendor_name}
                      className="md:w-[7rem] w-[5rem] h-20 rounded-xl md:h-[7rem] object-cover"
                    />
                    <div>
                      <div className="md:text-2xl text-lg font-bold">
                        {order.vendor_name}
                      </div>
                      <div>{locations[order.user_location - 1]?.label}</div>
                    </div>
                    <div>
                      <div className="bg-green-400 text-white px-2 md:text-lg text-sm py-2 font-medium uppercase">
                        {order.order_status}
                      </div>
                      <div className="md:text-lg text-sm">{formattedDate}</div>
                    </div>
                  </div>
                  <div className="my-2 py-4 px-8 w-full bg-gray-100">
                    <div>
                      {order.items.map((item) => (
                        <div
                          key={item.item_id}
                          className="flex justify-between"
                        >
                          <div className="font-medium text-lg">{item.name}</div>
                          <div>x {item.quantity}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between py-2">
                      <div className="text-lg font-medium">Total Amount :</div>
                      <div className="font-bold">{order.amount}</div>
                    </div>
                  </div>
                </a>
                <div className="bg-white p-4">
                  <div className="text-xl font-semibold">Rate Your Order:</div>
                  <div className="flex gap-2">
                    <div className="mx-4 text-gray-600 text-lg">
                      {order.vendor_name}:
                    </div>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const restaurantRating =
                        order.rating || ratings[order._id]?.res_rating || 0;
                      return (
                        <button
                          key={star}
                          onClick={() =>
                            handleRestaurantRatingChange(order._id, star)
                          }
                          className={`text-xl ${
                            ratingsSubmitted[order.order_id] ||
                            star <= restaurantRating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                          disabled={
                            ratingsSubmitted[order.order_id] || restaurantRating
                          }
                        >
                          ★
                        </button>
                      );
                    })}
                  </div>
                  <div>
                    {order.items.map((item) => {
                      const itemRating =
                        item.rating || ratings[order._id]?.[item._id] || 0;
                      const key = `${order.order_id}_${item._id}`;
                      return (
                        <div key={item._id} className="flex items-center">
                          <div className="mx-4 text-gray-600 text-lg">
                            {item.name}:
                          </div>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() =>
                                handleItemRatingChange(
                                  order._id,
                                  item._id,
                                  star
                                )
                              }
                              className={`text-xl ${
                                ratingsSubmitted[key] || star <= itemRating
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              }`}
                              disabled={ratingsSubmitted[key] || itemRating}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <ShimmerSimpleGallery card imageHeight={200} col={1} />
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
