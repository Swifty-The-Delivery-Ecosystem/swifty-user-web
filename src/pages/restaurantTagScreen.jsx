import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import star from "../assets/images/star.png";
import { ShimmerSimpleGallery } from "react-shimmer-effects";

const RestaurantTagScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vendors, tag } = location.state;
  return (
    <div className="md:mx-12 md:my-4">
      <div className="md:text-4xl text-lg font-extrabold">{tag}</div>
      <div className="md:text-lg text-sm font-semibold">
        Cheesilicious {tag}s to make every day extraordinary.
      </div>
      <div className="flex justify-start gap-6">
        {vendors.length !== 0 ? (
          vendors.map((restaurant, index) => (
            <div className=" flex justify-evenly gap-6 md:my-4 px-4 py-4 rounded-xl shadow-xl w-fit">
              <div
                onClick={() => {
                  navigate("/restaurant", {
                    state: { restaurant: restaurant },
                  });
                }}
                key={index}
                className="rounded-xl hover:cursor-pointer mx-auto items-center"
              >
                <img
                  src={restaurant.images[0]}
                  alt={restaurant.name}
                  className="w-[12rem] mx-auto object-cover h-[12rem] rounded-xl mb-2"
                />
                <div className="text-left">
                  <div className="text-xl font-bold">
                    {restaurant.restaurantName}
                  </div>
                  <div className="text-[16px] flex gap-2 items-center text-gray-500">
                    <img src={star} alt="" className="w-6 h-6" />{" "}
                    {restaurant.rating}
                  </div>
                  <div className="text-[14px] text-gray-600 font-medium mb-1">
                    {restaurant.description}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <ShimmerSimpleGallery card imageHeight={200} caption />
        )}
      </div>
    </div>
  );
};

export default RestaurantTagScreen;
