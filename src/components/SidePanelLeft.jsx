import LocationCards from "./LocationCards"
export default function SidePanelLeft (){
    return (
        <div className="h-100 bg-black">
            <div className="" style={{backgroundColor:'#3E3E3EA3',color:'#E7BDB9'}}>
            <div className="relative">
                <div className=" text-center m-2 p-4 rounded-3xl">
                    <h1 className="text-3xl"><i class="fa-solid fa-map"></i>&nbsp;Places</h1>
                </div>
                <div className="relative side-panel p-1 left-0 flex flex-col">
                    <LocationCards/>
                </div>
                <div>
                </div>
            </div>

        </div>
        </div>
    )
}