import { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import { BsFillCartFill } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { SimpleDropdown } from "react-js-dropdavn";
import "react-js-dropdavn/dist/index.css";
import { useCart } from "../context/cartcontext";
import { useSetlocation } from "../context/locationContext";
import { useProfile } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { useRestaurant } from "../context/restaurant_details";
// import { useSetlocation } from "../context/locationContext";

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { selectedLocation, setSelectedLocation } = useSetlocation();
  const { cartItems } = useCart();
  const { userData, loading, setloading } = useProfile();
  const dropdownRef = useRef(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(
    window.location.pathname !== "/login" || "/register"
  );
  const { fetchRestaurant } = useRestaurant();

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setloading(true);
    }
  }, []);

  // useEffect(() => {
  //   if (!loading && userData) {
  //     setAuthenticated(true); // Set authenticated to true when loading is false and userData exists
  //   }
  // }, []);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setloading(true);
    }
  }, []);

  // useEffect(() => {
  //   if (!loading && userData) {
  //     setAuthenticated(true); // Set authenticated to true when loading is false and userData exists
  //   }
  // }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setloading(false);
    navigate("/login");
  };

  const navmenu = [
    {
      link: "/update",
      name: "Update Profile",
    },
    {
      link: "/orders",
      name: "Contact",
    },
    {
      link: userData ? "/" : "/login",
      name: userData ? userData.name : "Sign in",
    },
  ];
  const locations = [
    { label: "Kanhar", value: 1 },
    { label: "Indravati", value: 2 },
    { label: "MSH", value: 3 },
    { label: "Mess Block", value: 4 },
    { label: "Delta", value: 5 },
  ];
  const [searchtext, setsearchtext] = useState("");

  return (
    <nav className="flex z-50 bg-white top-0 sticky shadow-lg items-center justify-between h-16 lg:px-[70px] md:h-20 px-5 ">
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
              onChange={(value) => {
                console.log(value);
                setSelectedLocation(value);
                fetchRestaurant(value.value);
              }}
              labels={{
                notSelected: `${selectedLocation.label}`,
                selectedPrefix: `${selectedLocation.label}`,
                search: "Search area",
                searchInputPlaceholder: "Search for typing",
              }}
              configs={{
                position: { y: "bottom", x: "center" },
                fullWidthParent: true,
              }}
              className="w-full mx-4"
            />
          </div>
        </div>
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
                    activeClassName="text-green-700"
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
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </div>
              </NavLink>
            </div>
          </div>
        )}
      </div>

      <div className="hidden cursor-pointer items-center md:flex space-x-12 menu">
        <div
          onClick={() => {
            navigate("/search");
          }}
          className="hidden text-right md:block"
        >
          <div className="p-2 flex gap-2 items-center">
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
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <div>Search</div>
          </div>
        </div>
        {loading || localStorage.getItem("token") ? (
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={toggleDropdown}
              className="text-lg font-bold cursor-pointer"
            >
              <img
                src="https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png"
                alt=""
                className="w-11 h-11 rounded-full object-cover"
              />
            </div>
            {isDropdownVisible && (
              <div className="absolute top-12 z-50 right-0 bg-white shadow-md px-8 rounded-xl py-4 space-y-2">
                <NavLink to="/update" className="text-gray-700 font-bold block">
                  Update Profile
                </NavLink>
                <NavLink to="/orders" className="text-gray-700 block font-bold">
                  My Orders
                </NavLink>
                <div
                  onClick={handleLogout}
                  className="text-red-500 block font-bold cursor-pointer"
                >
                  Logout
                </div>
              </div>
            )}
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
              {cartItems.reduce((total, item) => total + item.quantity, 0)}
            </div>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
