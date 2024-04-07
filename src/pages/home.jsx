import React, { useEffect, useState, useRef } from "react";
import home from "../assets/images/home.png";
import star from "../assets/images/star.png";
import "../assets/css/home.css";
import { motion, useScroll } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShimmerSimpleGallery } from "react-shimmer-effects";
import { useSetlocation } from "../context/locationContext";
import { useCart } from "../context/cartcontext";
import MenuItem from "../components/simpleCard";
import { useProfile } from "../context/userContext";
import { useRestaurant } from "../context/restaurant_details";

const Home = () => {
  // const [restaurants, setRestaurants] = useState([]);
  const { restaurants, setRestaurants, recommendations, setRecommendations } =
    useRestaurant();
  const [restaurantsTag, setRestaurantsTag] = useState([]);
  // const [recommendations, setRecommendations] = useState([]);
  const ref = useRef(null);
  const { scrollXProgress } = useScroll({ container: ref });
  const navigate = useNavigate();
  const { selectedLocation, setSelectedLocation } = useSetlocation();
  const { userData } = useProfile();

  const tags = [
    {
      name: "Pizza",
      url: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029856/PC_Creative%20refresh/3D_bau/banners_new/Pizza.png",
    },
    {
      name: "Paratha",
      url: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029853/PC_Creative%20refresh/3D_bau/banners_new/Paratha.png",
    },
    {
      name: "Biryani",
      url: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1675667625/PC_Creative%20refresh/Biryani_2.png",
    },
    {
      name: "Paratha",
      url: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029853/PC_Creative%20refresh/3D_bau/banners_new/Paratha.png",
    },
    {
      name: "Rolls",
      url: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029858/PC_Creative%20refresh/3D_bau/banners_new/Rolls.png",
    },
    {
      name: "Chinese",
      url: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029848/PC_Creative%20refresh/3D_bau/banners_new/Chinese.png",
    },
    {
      name: "Sandwich",
      url: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029860/PC_Creative%20refresh/3D_bau/banners_new/Sandwich.png",
    },
    {
      name: "NorthIndian",
      url: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1675667625/PC_Creative%20refresh/North_Indian_4.png",
    },
    {
      name: "SouthIndian",
      url: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1675667626/PC_Creative%20refresh/South_Indian_4.png",
    },
    {
      name: "Coffee",
      url: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029846/PC_Creative%20refresh/3D_bau/banners_new/Coffee.png",
    },
  ];

  useEffect(() => {
    fetch(
      `https://inventory-service-git-main-swiftyeco.vercel.app/api/v1/inventory/customer/vendors?location=${selectedLocation.value}`,
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

  useEffect(() => {
    userData && console.log(userData._id);
    let token = localStorage.getItem("token");
    token &&
      userData &&
      fetch(
        `https://order-service-peach.vercel.app/api/v1/order_service/user/recommend/${userData._id}`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setRecommendations(data.recommendedItems);
          console.log(recommendations);
        })
        .catch((error) => console.error("Error fetching data:", error));
  }, [userData]);

  const handleTagClick = (tag) => {
    fetch(
      `https://inventory-service-git-main-swiftyeco.vercel.app/api/v1/inventory/customer/vendors?location=${selectedLocation.value}&tag=${tag}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        navigate(`/restaurants/${tag}`, {
          state: { vendors: data, tag: tag },
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  return (
    <div className="mb-4 md:mx-16 mx-0">
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
        <div className="md:text-3xl text-xl mx-8 my-6 font-extrabold font-roboto">
          Restaurants near you
        </div>
        <ul
          className="mx-8 my-8 flex gap-8 overflow-y-hidden relative"
          ref={ref}
        >
          {restaurants.length !== 0 ? (
            restaurants.map((restaurant, index) => (
              <li
                onClick={() => {
                  navigate("/restaurant", {
                    state: { restaurant: restaurant },
                  });
                }}
                key={index}
                className="rounded-xl hover:cursor-pointer items-center"
              >
                <img
                  src={restaurant.images[0]}
                  alt={restaurant.restaurantName}
                  className="w-80 h-40 object-cover rounded-xl mb-2"
                />
                <div className="text-left">
                  <div className="md:text-xl text-lg font-bold">
                    {restaurant.restaurantName}
                  </div>
                  <div className="text-[16px] flex gap-2 items-center text-gray-500">
                    <img src={star} alt="" className="w-6 h-6" />{" "}
                    {restaurant.ratings}
                  </div>
                  <div className="text-[14px] text-gray-600 font-medium mb-1">
                    {restaurant.tags.slice(0, 4).join(" ,")}
                  </div>
                  <div className="text-[14px] text-gray-600 font-medium mb-1">
                    {restaurant.description.length > 28
                      ? `${restaurant.description.slice(0, 28)}...`
                      : restaurant.description}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <ShimmerSimpleGallery card imageHeight={200} caption />
          )}
        </ul>

        <div className="md:text-3xl text-xl mx-8 my-6 font-extrabold font-roboto">
          What's on your mind?
        </div>
        <ul className="mx-8 my-8 flex gap-8 relative" ref={ref}>
          {restaurants && restaurants.length !== 0 ? (
            tags.map((tag, index) => (
              <li
                onClick={() => {
                  handleTagClick(tag.name);
                }}
                key={index}
                className="rounded-xl hover:cursor-pointer items-center"
              >
                <img src={tag.url} alt={tag.name} />
              </li>
            ))
          ) : (
            <ShimmerSimpleGallery card imageHeight={200} caption />
          )}
        </ul>
        <motion.div
          className="progress-indicator-line"
          style={{
            width: scrollXProgress ? `${scrollXProgress * 100}%` : "0%",
          }}
        />
        <div className="md:text-4xl text-xl mx-8 my-6 font-extrabold loader text-transparent bg-gradient-to-r from-blue-300 via-pink-400 to-blue-400 bg-clip-text font-roboto">
          {/* <div class="rounded-md border-none  bg-cover bg-no-repeat h-5 animate-loader"></div> */}
          Personalized Recommendations for you
        </div>
        {localStorage.getItem("token") ? (
          <ul className="mx-8 my-8 flex gap-8 relative" ref={ref}>
            {recommendations && recommendations.length !== 0 ? (
              recommendations.map((food, index) => {
                const restaurant = restaurants.find(
                  (restaurant) => restaurant._id === food.vendor_id
                );
                return (
                  <li
                    onClick={() => {
                      navigate("/restaurant", {
                        state: { restaurant: restaurant },
                      });
                    }}
                    key={index}
                    className="rounded-xl hover:cursor-pointer items-center"
                  >
                    <img
                      src={food.image_url}
                      alt={food.name}
                      className="w-80 h-40 object-cover rounded-xl mb-2"
                    />
                    <div className="text-left">
                      <div className="md:text-xl text-lg font-bold">
                        {food.name}
                      </div>
                      <div className="text-[16px] font-bold  items-center">
                        ₹ {food.price}
                      </div>
                      <div className="text-[14px] text-gray-600 font-medium mb-1">
                        {food.tags.slice(0, 4).join(" ,")}
                      </div>
                      <div className="text-[14px] text-gray-600 font-medium mb-1">
                        {food.description.length > 28
                          ? `${food.description.slice(0, 28)}...`
                          : food.description}
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <ShimmerSimpleGallery card imageHeight={200} caption />
            )}
          </ul>
        ) : (
          <div className="text-center items-center my-16 text-2xl font-bold text-gray-500">
            Login to see personalized recommendations
          </div>
        )}
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
