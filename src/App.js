import "@fortawesome/fontawesome-free/css/all.min.css";
import SidePanelLeft from "./components/SidePanelLeft";
import SidePanelRight from "./components/SidePanelRight";
import MobileMap from "./components/MobileMap";
import SidebarLeft from "./components/SidebarLeft";
import Main from "./components/Main";
import Fetch from "./components/FetchData";
function App() {
  const screenWidth = window.innerWidth;

  return (
    <div className="">
      <Fetch/>
      <div className="element md:hidden block">
       
        <MobileMap/>  
        <div className="fixed bottom-0 w-full bg-black rounded-t-2xl">
        <SidebarLeft/>
        </div>
      </div>
      <div className="element hidden lg:block">
        <Main>
        <SidePanelLeft/>
        <SidePanelRight/>
        </Main>
      </div>
    </div>
  );
}

export default App;
