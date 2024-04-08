import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaTwitter } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Verify() {
  const [otp, setOtp] = useState();
  const location = useLocation();
  const nav = useNavigate();

  const email = location.state.email;
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      nav("/");
    }
  }, [nav]);
  const sendLoginRequest = () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const url = "https://auth-six-pi.vercel.app/api/v1/auth/users/verify";
    const data = {
      email: String(email),
      in_otp: Number(otp),
    };

    axios
      .post(url, data, { headers })
      .then((response) => {
        if (response.data && response.data.type === "success") {
          localStorage.setItem("token", response.data.data.token);
          nav("/");
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="min-h-screen mt-8 flex flex-wrap">
      <div className="w-1/2 md:block text-center hidden mx-auto my-4">
        <img
          src="https://i.ibb.co/3kg7By0/image.png"
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
                Your OTP Number
              </div>
              <div className="px-4">
                <input
                  type="number"
                  value={otp}
                  name="otp"
                  id="otp"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Otp Number"
                  onChange={handleOtpChange}
                  required=""
                />
              </div>
            </div>
            <div></div>
            <div className="my-1 text-center font-light">or</div>

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

export default Verify;
