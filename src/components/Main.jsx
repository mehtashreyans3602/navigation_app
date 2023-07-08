import Map from "./Map"
export default (props) => {
    return (
        <div className="h-fit">
            <div className=" sticky w-screen text-center bg-black" >
                <h1 className="text-3xl p-4" style={{ backgroundColor: '#3E3E3EA3', color: '#E7BDB9' }}>PU NAV</h1>
            </div>
            <div className="flex justify-between">
                <div style={{ height:'90vh'}} className="overflow-y-auto">{props.children[0]}</div>
                <div className="w-full border-4 border-slate-600 p-1 m-2">
                    <Map />
                </div>
                <div style={{ height:'90vh'}} className="overflow-y-auto" >{props.children[1]}</div>
            </div>
            <div className=" w-screen text-center bg-black grid grid-cols-2 justify-end" >
                <div className="w-screen text-2xl p-4" style={{ backgroundColor: '#3E3E3EA3', color: '#E7BDB9' }}></div>
            </div>
        </div>
    )
}