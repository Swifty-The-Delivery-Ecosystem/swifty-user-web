import React, { useState } from "react";
import { useProfile } from "../context/userContext";
import axios from "axios";
import { useSetlocation } from "../context/locationContext";
import { SimpleDropdown } from "react-js-dropdavn";
import "react-js-dropdavn/dist/index.css";

const UpdateProfile = () => {
  const { userData, setUserData } = useProfile();
  const { selectedLocation, setSelectedLocation } = useSetlocation();
  let token = localStorage.getItem("token");
  const [updatedData, setUpdatedData] = useState({
    name: userData.name,
    phone: userData.phone,
    is_veg: userData.is_veg,
    primary_location: userData.primary_location,
    // Add other fields as needed
  });
  const locations = [
    { label: "BH1", value: 1 },
    { label: "BH2", value: 2 },
    { label: "GH1", value: 3 },
    { label: "GH2", value: 4 },
  ];

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUpdatedData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await axios.put(
        `https://auth-six-pi.vercel.app/api/v1/auth/users/${userData._id}/update`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.type === "success") {
        setUserData(response.data.data.user);
        console.log("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      {userData && (
        <div className="bg-white w-full md:w-1/2 px-8 py-6 shadow-xl rounded-lg">
          <div className="text-xl text-center font-bold font-roboto">
            Update Profile
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="text-sm font-medium text-gray-600">
              User Name
            </label>
            <input
              type="text"
              placeholder={userData.name}
              id="name"
              className="input-field"
              value={updatedData.name}
              onChange={handleInputChange}
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-gray-600"
            >
              Phone Number
            </label>
            <input
              type="number"
              placeholder={userData.phone}
              id="phone"
              className="input-field"
              value={updatedData.phone}
              onChange={handleInputChange}
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            />
          </div>
          {/* <div className="mb-4">
            <label htmlFor="is_veg" className="text-sm font-medium text-gray-600">
              Is Veg
            </label>
            <input
              type="text"
              placeholder={userData.is_veg}
              id="is_veg"
              className="input-field"
              value={updatedData.is_veg}
              onChange={handleInputChange}
            />
          </div> */}
          <div className="mb-4">
            <label
              htmlFor="primary_location"
              className="text-sm font-medium text-gray-600"
            >
              Primary Location
            </label>
            <SimpleDropdown
              options={locations}
              searchable
              onChange={(value) => {
                setSelectedLocation(value);
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
          <div className="mx-auto">
            <button
              onClick={handleUpdateProfile}
              className="bg-blue-600 mx-auto text-center text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-light-blue-500"
            >
              Update Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateProfile;
