import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { LocationProvider } from "./context/locationContext";
import { CartProvider } from "./context/cartcontext";
import { RestaurantProvider } from "./context/restaurant_details";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CartProvider>
      <RestaurantProvider>
        <LocationProvider>
          <App />
        </LocationProvider>
      </RestaurantProvider>
    </CartProvider>
  </React.StrictMode>
);
