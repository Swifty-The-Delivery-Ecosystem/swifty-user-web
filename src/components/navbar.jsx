import { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import { BsFillCartFill } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { SimpleDropdown } from "react-js-dropdavn";
import "react-js-dropdavn/dist/index.css";
import { useCart } from "../context/cartcontext";
import { FaBell } from "react-icons/fa";
import { useSetlocation } from "../context/locationContext";
import { useProfile } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { useRestaurant } from "../context/restaurant_details";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Ably from "ably";
import { faBars, faBell, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { selectedLocation, setSelectedLocation } = useSetlocation();
  const { cartItems } = useCart();
  const { userData, loading, setloading } = useProfile();
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const { fetchRestaurant } = useRestaurant();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationDropdownVisible, setNotificationDropdownVisible] =
    useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
    setNotificationDropdownVisible(false);
  };

  const toggleNotificationDropdown = () => {
    setNotificationDropdownVisible(!isNotificationDropdownVisible);
    setDropdownVisible(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  const handleClickOutsideNotif = (event) => {
    if (notifRef.current && !notifRef.current.contains(event.target)) {
      setNotificationDropdownVisible(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setloading(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("click", handleClickOutsideNotif);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("click", handleClickOutsideNotif);
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
      name: "My Orders",
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

  useEffect(() => {
    if (
      window.location.pathname !== "/login" ||
      window.location.pathname !== "/register"
    ) {
      const ably = new Ably.Realtime(
        "hX9Akw.BZVKSg:HVVgnbhR_pFHqjkjM59yeNLbbDiceXG5VIzow8kSUPQ"
      );
      const channel = ably.channels.get("offers");
      channel.subscribe("newOffer", (message) => {
        console.log("New offer received!", message);
        toast.success(message.data, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Update state with new notification
        const newNotification = { message: message.data, id: Date.now() };
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          newNotification,
        ]);
        setUnreadCount((prevCount) => prevCount + 1);
      });

      // Load notifications from localStorage
      const storedNotifications =
        JSON.parse(localStorage.getItem("notifications")) || [];
      setNotifications(storedNotifications);
      setUnreadCount(storedNotifications.length);

      return () => {
        channel.unsubscribe();
      };
    }
  }, []);


  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.setItem("notifications", JSON.stringify([]));
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
    localStorage.setItem(
      "notifications",
      JSON.stringify(notifications.filter((notif) => notif.id !== id))
    );
    setUnreadCount((prevCount) => prevCount - 1);
  };

  useEffect(() => {
    const storedNotifications =
      JSON.parse(localStorage.getItem("notifications")) || [];
    setNotifications(storedNotifications);
    setUnreadCount(storedNotifications.length);
  }, []);

  return (
    <div className="sticky z-50 top-0">
      <ToastContainer />
      <nav className="flex bg-white shadow-lg items-center justify-between h-16 lg:px-[70px] md:h-20 px-5 ">
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
            <IoMdClose
              className="text-3xl cursor-pointer"
              onClick={toggleMenu}
            />
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
                    {cartItems.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
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
          <div ref={notifRef} className="relative mr-4">
            <div onClick={toggleNotificationDropdown} className="flex relative">
              <FaBell className="text-4xl text-purple-700" />
              <div className="absolute text-white text-xs inset-0 flex justify-center items-center font-bold">
                {unreadCount}
              </div>
            </div>
            {isNotificationDropdownVisible && (
              <div className="absolute top-12 z-50 right-0 bg-white shadow-md p-2 w-[12rem] rounded-lg overflow-hidden notification-dropdown">
                {notifications.length === 0 ? (
                  <div className="p-2 text-center text-gray-500">No notifications</div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-2 flex gap-2 items-center items-center border-b border-gray-200"
                    >
                      <p className="text-sm flex-grow">{notification.message}</p>
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="text-gray-500"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  ))
                )}
                <button
                  onClick={clearAllNotifications}
                  className="w-full py-2 text-center text-gray-500 border-t border-gray-200"
                >
                  Clear All
                </button>
              </div>
            )}
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
                  <NavLink
                    to="/update"
                    className="text-gray-700 font-bold block"
                  >
                    Update Profile
                  </NavLink>
                  <NavLink
                    to="/orders"
                    className="text-gray-700 block font-bold"
                  >
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
    </div>
  );
};

export default Navbar;
