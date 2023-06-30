import "@fortawesome/fontawesome-free/css/all.min.css";
import Directions from "./components/Directions";
import MobileDirections from "./components/Mobile";
import SidebarLeft from "./components/SidebarLeft";
import Map from "./components/Map";
import Main from "./components/Main";
function App() {
  const screenWidth = window.innerWidth;

  return (
    <div className="">
      <div className="element md:hidden block ">
        <MobileDirections />
      </div>
      <div className="element hidden lg:block">
        <Main/>
      </div>
    </div>
  );
}

export default App;
