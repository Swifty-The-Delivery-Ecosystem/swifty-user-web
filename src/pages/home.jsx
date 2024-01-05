import React, { useEffect, useState } from "react";
import home from "../assets/images/home.jpg";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const locationParam = 1;

    fetch(
      `http://localhost:4005/api/customer/restaurants?location=${locationParam}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setRestaurants(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  console.log(restaurants);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-orange-200 to-orange-500">
      <div className="text-center text-white mb-8">
        <div className="text-lg font-semibold">
          <span className="text-sm">To Cure your</span>
        </div>
        <div className="text-2xl font-bold">
          <span>Night Time Cravings</span>
        </div>
      </div>
      <div>
        <img src={home} alt="homepage" className="h-40 w-40" />
      </div>
      <div className="flex flex-row mt-8">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            className="bg-white p-4 rounded-md shadow-md m-4 flex flex-col items-center"
          >
            <img
              src={restaurant.image_url}
              alt={restaurant.name}
              className=" w-full mb-2 "
            />
            <div className="text-sm font-semibold mb-1">{restaurant.name}</div>
            <div className="text-sm font-semibold mb-1">
              {restaurant.description}
            </div>
            <div className="text-xs text-gray-500 mb-2">
              {restaurant.rating.$numberDecimal.toString()}
            </div>
            {/* Add other restaurant details as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
