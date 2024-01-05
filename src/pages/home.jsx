import React, { useEffect, useState, useRef } from "react";
import home from "../assets/images/home.png";
import star from "../assets/images/star.png";
import "../assets/css/home.css";
import { motion, useScroll } from "framer-motion";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const ref = useRef(null);
  const { scrollXProgress } = useScroll({ container: ref });

  useEffect(() => {
    const locationParam = 1;

    fetch(
      `https://inventory-service-git-main-swiftyeco.vercel.app/api/customer/restaurants?location=${locationParam}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Repeat the restaurants 10 times
        const repeatedRestaurants = Array.from(
          { length: 4 },
          () => data
        ).flat();
        setRestaurants(repeatedRestaurants);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="mb-4">
      <div>
        <div className="bg-gradient-to-r from-purple-300 to-purple-500 px-4 md:rounded-bl-[24rem] md:rounded-tr-[4rem] py-4 bg-opacity-50 flex justify-between">
          <div className="align-middle md:ml-12 md:pl-12 my-auto items-center">
            <div className="text-white text-lg md:text-5xl font-normal">
              Crub your
            </div>
            <div className="text-white text-lg md:text-5xl font-bold">
              Mid-Night Cravings
            </div>
          </div>
          <div>
            <img
              className="md:w-[460px] w-[200px] h-[230px] md:h-[420px]"
              src={home}
              alt="hello"
            />
          </div>
        </div>

        <ul className="mx-8 my-8 flex gap-8 relative" ref={ref}>
          {restaurants.map((restaurant, index) => (
            <li key={index} className="rounded-xl items-center">
              <img
                src={restaurant.image_url}
                alt={restaurant.name}
                className=" w-3/4 rounded-xl mb-2 "
              />
              <div className="text-left">
                <div className="text-lg font-bold">{restaurant.name}</div>
                <div className="text-[16px] flex gap-2 items-center text-gray-500">
                  <img src={star} alt="" className="w-6 h-6" />{" "}
                  {restaurant.rating.$numberDecimal.toString()}
                </div>
                <div className="text-[14px] text-gray-600 font-medium mb-1">
                  {restaurant.description}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <motion.div
          className="progress-indicator-line"
          style={{
            width: scrollXProgress ? `${scrollXProgress * 100}%` : "0%",
          }}
        />
      </div>
    </div>
  );
};

export default Home;
