import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { useSetlocation } from "../context/locationContext";
import { useNavigate } from "react-router-dom";
import { useRestaurant } from "../context/restaurant_details";
import { ShimmerSimpleGallery } from "react-shimmer-effects";
import star from "../assets/images/star.png";
import { useProfile } from "../context/userContext";

const Search = () => {
  const ref = useRef(null);
  const { scrollXProgress } = useScroll({ container: ref });
  const navigate = useNavigate();
  const { selectedLocation, setSelectedLocation } = useSetlocation();
  const { restaurants, setRestaurants, recommendations, setRecommendations } =
    useRestaurant();
  const [selectedButton, setSelectedButton] = useState("restaurant");
  const [searchTerm, setSearchTerm] = useState("");
  const { userData } = useProfile();
  const [searchRestaurant, setSearchRestaurant] = useState(restaurants);
  const [searchItems, setsearchItems] = useState(recommendations);

  useEffect(() => {
    if (restaurants.length !== 0) return;
    fetch(
      `https://inventory-service-mqul.onrender.com/api/v1/inventory/customer/vendors?location=${selectedLocation.value}`,
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
        setSearchRestaurant(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    let token = localStorage.getItem("token");
    token &&
      userData &&
      recommendations.length === 0 &&
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
          setRecommendations(data.recommendedItems);
          setsearchItems(data.recommendedItems);
        })
        .catch((error) => console.error("Error fetching data:", error));
  }, [userData]);

  const handleSearch = () => {
    if (!searchTerm) {
      setSearchRestaurant(restaurants);
      setsearchItems(recommendations);
      return;
    }

    const itemSearchUrl = `https://inventory-service-mqul.onrender.com/api/v1/inventory/customer/searchItem?itemName=${searchTerm}`;
    const restaurantSearchUrl = `https://inventory-service-mqul.onrender.com/api/v1/inventory/customer/searchRestaurant?restaurantName=${searchTerm}`;

    Promise.all([
      fetch(itemSearchUrl).then((response) => response.json()),
      fetch(restaurantSearchUrl).then((response) => response.json()),
    ])
      .then(([itemsData, restaurantsData]) => {
        setSearchRestaurant(restaurantsData);
        setsearchItems(itemsData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

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

  const handleButtonClick = (button) => {
    setSelectedButton(button);
  };

  return (
    <div className="w-1/2 mx-auto">
      <div className="mx-auto items-center text-center">
        <div className="flex mt-8 items-center">
          <input
            type="text"
            name="Search"
            id="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-50 w-full border hover:border-orange-500 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block p-2.5"
            placeholder="Search your dishes or restaurants . . ."
            required=""
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button
            onClick={handleSearch}
            className="mx-4 bg-purple-400 px-4 py-2 rounded-lg text-white hover:bg-purple-500"
          >
            Search
          </button>
        </div>
      </div>
      <div className="mx-auto mb-4 ">
        <div className="flex mx-auto justify-start mt-4">
          <button
            className={`mx-4 py-2 px-4 rounded-lg ${
              selectedButton === "restaurant"
                ? "bg-black text-white"
                : "bg-white text-black border border-black"
            }`}
            onClick={() => handleButtonClick("restaurant")}
          >
            Restaurant
          </button>
          <button
            className={`mx-4 py-2 px-4 rounded-lg ${
              selectedButton === "dish"
                ? "bg-black text-white"
                : "bg-white text-black border border-black"
            }`}
            onClick={() => handleButtonClick("dish")}
          >
            Dish
          </button>
        </div>
      </div>
      <div className="mt-2 h-fit">
        <div className="text-xl mx-8  mt-2 font-extrabold font-roboto">
          Popular Cuisines
        </div>
        <ul className="mx-8 h-fit flex gap-4" ref={ref}>
          {tags.map((tag, index) => (
            <li
              onClick={() => {
                handleTagClick(tag.name);
              }}
              key={index}
              className="rounded-xl h-fit hover:cursor-pointer items-center"
            >
              <img src={tag.url} className="w-3/4" alt={tag.name} />
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

      {selectedButton === "restaurant" && (
        <div className="h-full bg-gray-100 p-4">
          {/* <ul className="mx-8 flex gap-8"> */}
          {searchRestaurant.length !== 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {searchRestaurant.map((restaurant, index) => (
                <div
                  key={index}
                  onClick={() => {
                    navigate("/restaurant", {
                      state: { restaurant: restaurant },
                    });
                  }}
                  className="rounded-xl grid grid-cols-2 gap-4 bg-white p-4 hover:cursor-pointer items-center"
                >
                  <img
                    src={restaurant.images[0]}
                    alt={restaurant.restaurantName}
                    className="w-[10rem] h-[10rem] object-cover rounded-xl mb-2 mr-4"
                  />
                  <div className="text-left">
                    <div className="text-lg font-bold">
                      {restaurant.restaurantName}
                    </div>
                    <div className="text-sm flex gap-2 items-center text-gray-500">
                      <img src={star} alt="" className="w-4 h-4" />{" "}
                      {restaurant.ratings}
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
      )}
      {selectedButton === "dish" && localStorage.getItem("token") ? (
        <div className="h-full bg-gray-100 p-4">
          {searchItems && searchItems.length !== 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {searchItems.map((food, index) => {
                const restaurant = restaurants.find(
                  (restaurant) => restaurant._id === food.vendor_id
                );
                return (
                  <div
                    onClick={() => {
                      navigate("/restaurant", {
                        state: { restaurant: restaurant },
                      });
                    }}
                    key={index}
                    className="rounded-xl grid grid-cols-2 gap-4 bg-white p-4 hover:cursor-pointer items-center"
                  >
                    <img
                      src={food.image_url}
                      alt={food.name}
                      className="w-[10rem] h-[10rem] object-cover rounded-xl mb-2 mr-4"
                    />
                    <div className="text-left">
                      <div className="text-lg font-bold">{food.name}</div>
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
                      <div className="text-sm text-gray-600 font-medium mb-1">
                        {food.tags.slice(0, 4).join(" ,")}
                      </div>
                      <div className="text-sm text-gray-600 font-medium mb-1">
                        {food.description.length > 28
                          ? `${food.description.slice(0, 28)}...`
                          : food.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <ShimmerSimpleGallery card imageHeight={200} caption />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Search;
