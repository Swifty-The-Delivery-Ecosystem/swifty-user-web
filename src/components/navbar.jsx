import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import { BsFillCartFill } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { SimpleDropdown } from "react-js-dropdavn";
import "react-js-dropdavn/dist/index.css";

const Navbar = () => {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState();
  const [userData, setUserData] = useState(null);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // No token found, redirect to login or handle as needed
      // For example, navigate("/login");
      return;
    }

    // Fetch user data using the token
    fetchCurrentUser(token);
    // Your existing code for fetching restaurants can remain here
  }, []);

  const fetchCurrentUser = (token) => {
    fetch("http://localhost:5000/api/userAuth/currentUser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Current User:", data.data.user);
        setUserData(data.data.user);
        // You can set the user data in state if needed
      })
      .catch((error) => console.error("Error fetching current user:", error));
  };

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cart"));
    setCartItems(cartItems);
    if (cartItems !== null) {
      const itemTotal = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      setCartItemsCount(itemTotal);
    }
  }, [cartItemsCount]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };
  const navmenu = [
    {
      link: "/about",
      name: "About",
    },
    {
      link: "/contact",
      name: "Contact",
    },
    {
      link: userData ? "/" : "/login",
      name: userData ? userData.name : "Sign in", // Use user's name if available, otherwise use "Sign in"
    },
  ];
  const locations = [
    { label: "BH1", value: 1 },
    { label: "BH2", value: 2 },
    { label: "GH1", value: 3 },
    { label: "GH2", value: 4 },
  ];
  const [searchtext, setsearchtext] = useState("");

  return (
    <nav className="flex shadow-lg items-center justify-between h-16 lg:px-[70px] md:h-20 px-5 ">
      <div className="flex gap-6 items-center">
        <NavLink to="/">
          <Logo />
        </NavLink>
        <div className="flex gap-3 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
          <div className="w-8">
            <SimpleDropdown
              options={locations}
              searchable
              defaultValue={1}
              configs={{ position: { y: "bottom", x: "center" } }}
              className="w-8"
            />
          </div>
        </div>
      </div>
      <div className="w-1/2 hidden md:block">
        <input
          type="text"
          value={searchtext}
          name="Search"
          id="Search"
          class="bg-gray-50 border hover:border-orange-500 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
          placeholder="Search"
          required=""
        />
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        {isMenuOpen === true ? (
          <IoMdClose className="text-3xl cursor-pointer" onClick={toggleMenu} />
        ) : (
          <GiHamburgerMenu
            className="text-2xl cursor-pointer"
            onClick={toggleMenu}
          />
        )}
        {isMenuOpen && (
          <div className="absolute h-80 top-16 left-0 right-0 flex flex-col justify-evenly items-center bg-white shadow-md pb-5 z-20 ">
            {navmenu.map((menu) => {
              return (
                <div key={menu.name}>
                  <NavLink
                    to={menu.link}
                    activeclassname="text-green-700"
                    className="text-xl font-medium p-2"
                    onClick={toggleMenu}
                  >
                    {menu.name}
                  </NavLink>
                </div>
              );
            })}
            <div>
              <NavLink
                to="/cart"
                className="flex relative"
                onClick={toggleMenu}
              >
                <BsFillCartFill className="text-4xl text-green-700" />
                <div className="absolute text-white text-xs inset-0 flex justify-center items-center font-bold">
                  {cartItemsCount}
                </div>
              </NavLink>
            </div>
          </div>
        )}
      </div>
      {/* Desktop Menu */}
      <div className="hidden items-center md:flex space-x-12 menu">
        {userData ? ( // Check if user data is available
          <div>
            <div className=" text-lg font-bold">{userData.name}</div>
          </div>
        ) : (
          <div>
            <NavLink
              to="/login"
              className="text-lg text-white font-bold bg-purple-400 px-5 py-3 hover:bg-purple-600 rounded-xl"
            >
              Login
            </NavLink>
          </div>
        )}
        <div>
          <NavLink to="/cart" className="flex relative">
            <BsFillCartFill className="text-4xl text-purple-700" />
            <div className="absolute text-white text-xs inset-0 flex justify-center items-center font-bold">
              {cartItemsCount}
            </div>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
