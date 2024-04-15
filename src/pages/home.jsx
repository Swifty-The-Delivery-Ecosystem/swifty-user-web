import React, { useEffect, useState, useRef } from "react";
import home from "../assets/images/home.png";
import star from "../assets/images/star.png";
import "../assets/css/home.css";
import { motion, useScroll } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShimmerSimpleGallery } from "react-shimmer-effects";
import { useSetlocation } from "../context/locationContext";
import { useProfile } from "../context/userContext";
import { useRestaurant } from "../context/restaurant_details";

const Home = () => {
  const { restaurants, setRestaurants, recommendations, setRecommendations } =
    useRestaurant();
  const ref = useRef(null);
  const { scrollXProgress } = useScroll({ container: ref });
  const navigate = useNavigate();
  const { selectedLocation, setSelectedLocation } = useSetlocation();
  const { userData } = useProfile();
  const [showVegetarian, setShowVegetarian] = useState(false);
  const [showNonVegetarian, setShowNonVegetarian] = useState(false);
  const [offerItems, setofferItems] = useState([]);

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
      `https://inventory-service-mqul.onrender.com/api/v1/inventory/customer/getOfferItems`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setofferItems(data.menuItems);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    fetch(
      `https://inventory-service-mqul.onrender.com/api/v1/inventory/customer/vendors?primary_location=${selectedLocation.value}`,
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
        setRestaurants(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    let token = localStorage.getItem("token");
    token &&
      userData &&
      fetch(
        `https://order-service-git-main-swiftyeco.vercel.app/api/v1/order_service/user/recommendv2/${userData._id}`,
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
          setRecommendations(data.recommendedItems);
        })
        .catch((error) => console.error("Error fetching data:", error));
  }, [userData]);

  const handleTagClick = (tag) => {
    fetch(
      `https://inventory-service-mqul.onrender.com/api/v1/inventory/customer/vendors?location=${selectedLocation.value}&tag=${tag}`,
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

  const filteredRestaurants = restaurants.filter((restaurant) => {
    if (showVegetarian && showNonVegetarian) return true;
    if (showVegetarian) return restaurant.is_veg === true;
    if (showNonVegetarian) return restaurant.is_veg === false;
    return true;
  });
  const [sortBy, setSortBy] = useState(null);

  const sortedRestaurants = filteredRestaurants.slice().sort((a, b) => {
    if (sortBy === "lowToHigh") {
      return a.ratings - b.ratings;
    } else if (sortBy === "highToLow") {
      return b.ratings - a.ratings;
    } else {
      return 0;
    }
  });
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
        <div className="flex justify-center my-4">
          <button
            className={`mx-4 py-2 px-4 rounded-lg ${
              showVegetarian
                ? "bg-purple-500 text-white"
                : "bg-white text-black border border-black"
            }`}
            onClick={() => {
              setShowVegetarian(!showVegetarian);
            }}
          >
            Pure Veg
          </button>
          <select
            className="mx-4 p-2 rounded-md"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="lowToHigh">Rating: Low to High</option>
            <option value="highToLow">Rating: High to Low</option>
          </select>
        </div>
        <div
          className="mx-8 my-8 overflow-y-hidden flex gap-10 relative"
          ref={ref}
        >
          {sortedRestaurants.length !== 0 ? (
            sortedRestaurants.map((restaurant, index) => (
              <div
                onClick={() => {
                  navigate("/restaurant", {
                    state: { restaurant: restaurant },
                  });
                }}
                key={index}
                className="inline-block text-center  flex-none rounded-xl hover:cursor-pointer items-center"
              >
                <img
                  src={restaurant.images[0]}
                  alt={restaurant.restaurantName}
                  className="w-[20rem] h-[13rem] object-cover rounded-xl mb-2"
                />
                <div className="text-left px-2">
                  <div className="md:text-2xl text-lg font-medium mb-2">
                    {restaurant.restaurantName}
                  </div>
                  <div className="text-xl font-bold flex gap-2 items-center text-gray-900 mb-1">
                    <img src={star} alt="" className="w-8 h-8" />{" "}
                    {restaurant.ratings?.toFixed(1)}
                  </div>
                  <div className="text-lg text-gray-600 font-medium mb-1">
                    {restaurant.tags.slice(0, 4).join(" ,")}
                  </div>
                  <div className="text-lg text-gray-600 font-medium mb-1">
                    {restaurant.description.length > 28
                      ? `${restaurant.description.slice(0, 28)}...`
                      : restaurant.description}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <ShimmerSimpleGallery row={1} card imageHeight={200} />
          )}
        </div>
        <div className="md:text-3xl text-xl mx-8 my-6  font-extrabold font-roboto">
          Best Offers For You
        </div>
        <ul className="mx-8 my-8 flex gap-8 relative" ref={ref}>
          {offerItems && offerItems.length !== 0 ? (
            offerItems.map((food, index) => {
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
                    <h3 className="text-xl font-medium">
                      {food.on_offer ? (
                        <>
                          <span className="line-through text-lg text-gray-500">
                            ₹ {food.price}
                          </span>
                          <span className="text-xl mx-1 text-red-500">
                            ₹ {food.offer_price}
                          </span>
                        </>
                      ) : (
                        `₹${food.price}`
                      )}
                    </h3>
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

        <div className="md:text-3xl text-xl mx-8 my-6  font-extrabold font-roboto">
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
                      <h3 className="text-xl font-medium">
                        {food.on_offer ? (
                          <>
                            <span className="line-through text-lg text-gray-500">
                              ₹ {food.price}
                            </span>
                            <span className="text-xl mx-1 text-red-500">
                              ₹ {food.offer_price}
                            </span>
                          </>
                        ) : (
                          `₹${food.price}`
                        )}
                      </h3>
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
