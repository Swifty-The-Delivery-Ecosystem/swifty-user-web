import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import star from "../assets/images/star.png";
import { ShimmerSimpleGallery } from "react-shimmer-effects";
import ReactStars from "react-rating-stars-component";

const RestaurantTagScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vendors, tag } = location.state;
  return (
    <div className="md:mx-12 md:my-6">
      <div className="md:text-5xl font-serif text-lg font-extrabold">{tag}</div>
      <div className="md:text-2xl my-2 text-sm font-light">
        Cheesilicious {tag} dishes to make every day extraordinary.
      </div>

      <div className="md:text-lg mx-4 my-4 text-sm font-bold">
        Restaurants near you
      </div>
      <div className="flex justify-start gap-6">
        <div className="h-full flex justify-start gap-6 p-4">
          {/* <ul className="mx-8 flex gap-8"> */}
          {vendors.length !== 0 ? (
            <div className="flex justify-start gap-6 bg-gray-100 p-4 rounded-xl">
              {vendors.map((restaurant, index) => (
                <div
                  key={index}
                  onClick={() => {
                    navigate("/restaurant", {
                      state: { restaurant: restaurant },
                    });
                  }}
                  className="rounded-xl grid grid-cols-2 gap-2 bg-white p-4 hover:cursor-pointer items-center"
                >
                  <img
                    src={restaurant.images[0]}
                    alt={restaurant.restaurantName}
                    className="w-[12rem] h-[12rem] object-cover rounded-xl mb-2 mr-4"
                  />
                  <div className="text-left">
                    <div className="text-xl font-bold">
                      {restaurant.restaurantName}
                    </div>
                    <div className="text-sm flex gap-2 items-center text-gray-500">
                      <ReactStars
                        count={5}
                        // onChange={ratingChanged}
                        isHalf={true}
                        emptyIcon={<i className="far fa-star"></i>}
                        halfIcon={<i className="fa fa-star-half-alt"></i>}
                        fullIcon={<i className="fa fa-star"></i>}
                        activeColor="#ffd700"
                        value={restaurant.ratings || 4.5}
                        edit={false}
                        size={24}
                      />
                      {restaurant.ratings || 4.5}
                    </div>
                    <div className="text-sm text-gray-600 font-medium mb-1">
                      {restaurant.tags.slice(0, 4).join(" ,")}
                    </div>
                    {/* <div className="text-[14px] text-gray-600 font-medium mb-1">
                      {restaurant.description.length > 28
                        ? `${restaurant.description.slice(0, 28)}...`
                        : restaurant.description}
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ShimmerSimpleGallery card imageHeight={200} caption />
          )}
          {/* </ul> */}
        </div>
      </div>
    </div>
  );
};

export default RestaurantTagScreen;
