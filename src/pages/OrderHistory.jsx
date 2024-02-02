import React from "react";
import { useOrderHistory } from "../context/orderHistoryContext";

const OrderHistory = () => {
  const orders = useOrderHistory();
  const locations = [
    { label: "BH1", value: 1 },
    { label: "BH2", value: 2 },
    { label: "GH1", value: 3 },
    { label: "GH2", value: 4 },
  ];

  return (
    <div>
      {/* <div className="text-3xl font-medium my-8 text-center">Previous Orders</div> */}
      <div>
        {orders.orders.map((order) => {
          // Convert ISO date string to Date object
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
            <div className="bg-white md:w-[40%] md:mx-auto mx-2 items-center shadow-xl">
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
                    <div>{locations[order.user_location - 1].label}</div>
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
                    {order.items.map((item) => {
                      return (
                        <div className="flex justify-between">
                          <div className="font-medium text-lg">{item.name}</div>
                          <div>x {item.quantity}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between py-2">
                    <div className="text-lg font-medium">Total Amount :</div>
                    <div className="font-bold">{order.amount}</div>
                  </div>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderHistory;
