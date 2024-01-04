import './App.css';
import RestaurantScreen from './pages/restaurantPage';
import res1 from './sampleData/restaurantData';



function App() {
  return (
    <div className="App">
    Swifty
    <RestaurantScreen restaurant={res1} />
    </div>
  );
}

export default App;
