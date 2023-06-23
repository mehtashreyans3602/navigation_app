import Map from "./Map"
import './Main.css'
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
export default () => {
    const places = ["Parul University", "PIET", "PIT", "PPI", "PIMS", "PIAS", "PIP", "JNIM"];
    return (
        <div className="">
            <div className="">
                <div className="">

                    <Map />
                    <SidebarLeft/>
                    <SidebarRight/>

                </div>

            </div>

        </div>
    )
}