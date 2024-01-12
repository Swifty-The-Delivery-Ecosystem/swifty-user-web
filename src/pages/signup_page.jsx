import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaTwitter } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { SimpleDropdown } from "react-js-dropdavn";
import "react-js-dropdavn/dist/index.css";

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(1); // Set a default value

  const locations = [
    { label: "BH1", value: 1 },
    { label: "BH2", value: 2 },
    { label: "GH1", value: 3 },
    { label: "GH2", value: 4 },
  ];

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Redirect to home page if token is present
      navigate("/");
    }
  }, [navigate]);

  const sendLoginRequest = () => {
    const url = "https://auth-swifty.vercel.app/api/userAuth/register";
    const data = {
      name: username,
      email: email,
      password: password,
      phone: phone,
      primary_location: selectedLocation, 
    };

    axios
      .post(url, data)
      .then((response) => {
        // Show success toast
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        navigate("/verify", { state: { email: email } });
      })
      .catch((error) => {
        // Show error toast
        toast.error(error.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  };

  return (
    <div className="min-h-screen mt-8 flex flex-wrap">
      <div className="w-1/2 md:block text-center hidden mx-auto my-4">
        <img
          src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/authentication/illustration.svg"
          alt=""
          className="mx-auto text-center"
        />
      </div>
      <div className="md:w-1/2 w-full">
        <div className="md:mx-16 mx-2 md:mt-8 mt-4">
          <div className="bg-white pb-8 md:mx-16 mx-2 rounded-xl">
            <div className="pt-3 mb-0 pb-0 px-4">
              <span className="text-2xl text-orange-500 font-bold">Swifty</span>
              <span className="text-2xl text-blue-600 font-bold">
                {" "}
                Ecosystem
              </span>
            </div>
            <div className="px-4 mt-0 pt-0  font-light">
              Make your food orders in seconds. Already have an account?
              <a className="font-medium ml-1" href="/login">
                Sign in.
              </a>
            </div>
            <div>
              <div class="block mx-4 mt-2 mb-2 text-sm font-medium text-gray-900">
                Your Username
              </div>
              <div className="px-4">
                <input
                  type="text"
                  value={username}
                  name="username"
                  id="username"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="John"
                  onChange={handleUsernameChange}
                  required=""
                />
              </div>

              <div class="block mx-4 mt-2 mb-2 text-sm font-medium text-gray-900">
                Your Phone Number
              </div>
              <div className="px-4">
                <input
                  type="number"
                  value={phone}
                  name="phone"
                  id="phone"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Phone Number"
                  onChange={handlePhoneChange}
                  required=""
                />
              </div>

              <div class="block mx-4 mt-2 mb-2 text-sm font-medium text-gray-900">
                Your email
              </div>
              <div className="px-4">
                <input
                  type="email"
                  value={email}
                  name="email"
                  id="email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="name@company.com"
                  onChange={handleEmailChange}
                  required=""
                />
              </div>
            </div>
            <div>
              <div class="block mx-4 mt-2 mb-2 text-sm font-medium text-gray-900">
                Password
              </div>
              <div className="px-4">
                <input
                  type="password"
                  value={password}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  onChange={handlePasswordChange}
                  required=""
                />
              </div>
            </div>
            <div>
              <div class="mx-4 my-2 text-sm font-medium text-gray-900">
                Primary Location
              </div>
              <div className="w-full">
                <SimpleDropdown
                  options={locations}
                  searchable
                  defaultValue={1}
                  onChange={(value) => setSelectedLocation(value)}
                  configs={{
                    position: { y: "bottom", x: "center" },
                    fullWidthParent: true,
                  }}
                  className="w-full mx-4"
                />
              </div>
            </div>

            <div
              onClick={sendLoginRequest}
              className="text-white cursor-pointer bg-blue-600 hover:bg-blue-700 mt-4 rounded-lg mx-4 text-center py-2 px-auto"
            >
              Sign up to your account
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
