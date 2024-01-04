import "./App.css";
import Login from "./pages/login_page";
import RestaurantScreen from "./pages/restaurant";
import SignUp from "./pages/signup_page";
import res1 from "./sampleData/restaurantData";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RestaurantScreen restaurant={res1} />} />
        <Route path="/login" element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
