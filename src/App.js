import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Directions from './components/Directions';
import MobileDirections from './components/Mobile';

function App() {
  const screenWidth = window.innerWidth;

  return (
    <div className="App">
      <div className="element md:hidden block "><MobileDirections/></div>
      <div className="element hidden lg:block"><Directions></Directions></div>
    </div>
  );
}

export default App;
