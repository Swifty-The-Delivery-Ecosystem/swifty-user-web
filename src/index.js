import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { CartProvider } from "./context/cartcontext";
import { RestaurantProvider } from "./context/restaurant_details";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CartProvider>
      <RestaurantProvider>
        <App />
      </RestaurantProvider>
    </CartProvider>
  </React.StrictMode>
);
