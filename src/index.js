import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { LocationProvider } from "./context/locationContext";
import { CartProvider } from "./context/cartcontext";
import { RestaurantProvider } from "./context/restaurant_details";
import { UserProvider } from "./context/userContext";
import { OrderHistoryProvider } from "./context/orderHistoryContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CartProvider>
      <RestaurantProvider>
        <LocationProvider>
          <UserProvider>
            <OrderHistoryProvider>
              <App />
            </OrderHistoryProvider>
          </UserProvider>
        </LocationProvider>
      </RestaurantProvider>
    </CartProvider>
  </React.StrictMode>
);
