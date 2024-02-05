import React, { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext();

export const useSetlocation = () => {
  return useContext(LocationContext);
};

export const LocationProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState({
    label: "Kanhar",
    value: 1,
    index: 0,
  });
  const contextValue = {
    selectedLocation,
    setSelectedLocation,
  };

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
};
