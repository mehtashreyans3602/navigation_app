import "@fortawesome/fontawesome-free/css/all.min.css";
import SidePanelLeft from "./components/SidePanelLeft";
import SidePanelRight from "./components/SidePanelRight";
import MobileMap from "./components/MobileMap";
import SidebarLeft from "./components/SidebarLeft";
import Main from "./components/Main";
function App() {
  const screenWidth = window.innerWidth;

  return (
    <div className="">
      <div className="element md:hidden block ">
       
        <MobileMap/>  
        <SidebarLeft/>
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
