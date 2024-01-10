import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaTwitter } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState("");

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
    const url = "http://127.0.0.1:5000/api/userAuth/register";
    const data = {
      name: username,
      email: email,
      password: password,
      phone: phone,
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
            <div className="my-1 text-center font-light">or</div>
            <div className="border-2 cursor-pointer flex justify-center hover:bg-gray-50 rounded-lg mb-2 mx-4 text-center py-2 px-auto">
              <FcGoogle size={20} />{" "}
              <div className="ml-2">Sign in with Google</div>
            </div>
            <div className="border-2 flex justify-center cursor-pointer hover:bg-gray-50 rounded-lg mb-4 mx-4 text-center py-2 px-auto">
              <FaTwitter size={20} />{" "}
              <div className="ml-2">Sign in with Twitter</div>
            </div>
            <div class="flex items-center mx-4 justify-between">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                    required=""
                  />
                </div>
                <div class="ml-1 text-sm">
                  <div for="remember" class="text-gray-500">
                    Remember me
                  </div>
                </div>
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
