import { useState } from "react";
import { useDispatch } from "react-redux";
import { setAddress } from "../features/address/addressSlice";
import { closeLocationModal } from "../features/app/appSlice";

const LocationModal = () => {
  const [selectedLocation, setSelectedLocation] = useState(""); // State to store the selected location
  const [isLoading, setisLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const handleModalClose = () => {
    dispatch(closeLocationModal());
  };

  const handleLocationSubmit = async () => {
    try {
      setisLoading(true);

      // For simplicity, you can directly use the selected location as the address
      dispatch(setAddress(selectedLocation));

      // Close modal
      handleModalClose();
    } catch (error) {
      console.log(error);
    } finally {
      setisLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/70 fixed top-0 left-0 w-full h-full flex justify-center items-center">
      <div className="w-[90%] flex flex-col justify-center items-center max-w-[600px] m-auto p-8 bg-white rounded-md min-h-[240px]">
        <h1 className="text-2xl font-semibold">Please select your location</h1>
        <select
          value={selectedLocation}
          onChange={handleLocationChange}
          className="w-full max-w-[360px] my-4 p-2 border border-gray-400 rounded-md"
        >
          <option value="">Select Location</option>
          <option value="BH1">BH1</option>
          <option value="BH2">BH2</option>
          <option value="GH1">GH1</option>
          <option value="GH2">GH2</option>
        </select>
        <button
          onClick={handleLocationSubmit}
          disabled={!selectedLocation}
          className="w-full max-w-[360px] flex justify-center items-center gap-2 border p-2 px-4 my-4 bg-gray-50  shadow-sm rounded-md"
        >
          {isLoading ? (
            <p className="flex items-center gap-2">Accessing...Please wait</p>
          ) : (
            <p className="flex items-center gap-2">Confirm location</p>
          )}
        </button>
      </div>
    </div>
  );
};

export default LocationModal;
