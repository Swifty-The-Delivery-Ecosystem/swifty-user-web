import React, { createContext, useContext, useState, useEffect } from "react";
import { useSetlocation } from "./locationContext";

const UserContext = createContext();

export const useProfile = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setloading] = useState(false);
  const { selectedLocation, setSelectedLocation } = useSetlocation();
  const locations = [
    { label: "BH1", value: 1 },
    { label: "BH2", value: 2 },
    { label: "GH1", value: 3 },
    { label: "GH2", value: 4 },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }
    setloading(true);
    fetchCurrentUser(token);
  }, []);

  const fetchCurrentUser = (token) => {
    fetch("https://auth-six-pi.vercel.app/api/v1/auth/users/currentUser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserData(data.data.user);
        setSelectedLocation({
          label: locations[data.data.user.primary_location - 1].label,
          value: data.data.user.primary_location,
          index: data.data.user.primary_location - 1,
        });
      })
      .catch((error) => console.error("Error fetching current user:", error));
  };
  const contextValue = {
    userData,
    loading,
    setUserData,
    setloading,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
