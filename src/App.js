import './App.css';
import RestaurantScreen from './pages/restaurant';
import res1 from './sampleData/restaurantData';



function App() {
  return (
    <div className="App text-3xl font-bold underline">
    Swifty
    <RestaurantScreen restaurant={res1} />
    </div>
  );
}

export default App;
