import "./App.css";
import Login from "./pages/login_page";
import RestaurantScreen from "./pages/restaurantPage";
import SignUp from "./pages/signup_page";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import Checkout from "./pages/checkout";
import Verify from "./pages/verify_otp";
import RestaurantTagScreen from "./pages/restaurantTagScreen";
import DeliveryTrack from "./pages/deliveryTrack";
import OrderHistory from "./pages/OrderHistory";
import UpdateProfile from "./pages/updateProfile";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/restaurant" element={<RestaurantScreen />} />
        <Route path="/restaurants/:tag" element={<RestaurantTagScreen />} />
        <Route path="/cart" element={<Checkout />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/track" element={<DeliveryTrack />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/update" element={<UpdateProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
