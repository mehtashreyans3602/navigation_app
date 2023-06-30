import '@fortawesome/fontawesome-free/css/all.min.css';
import LocationCards from './LocationCards';

export default () => {
    return (
        <div className="absolute transform -translate-y-1/3 rounded-r-3xl " style={{backgroundColor:'#3E3E3EA3',color:'#E7BDB9'}}>
            <div className="relative">
                <div className="sticky top-0 text-center m-2 p-4 rounded-3xl">
                    <h1 className="text-3xl"><i class="fa-solid fa-map"></i>&nbsp;Places</h1>
                </div>
                <div className="relative side-panel p-1 left-0 flex flex-col overflow-y-auto" style={{ maxHeight: '50vh' }}>
                    <LocationCards/>
                </div>
                <div>
                <div className="sticky top-0 text-center text-white m-2 p-4 rounded-3xl">
                    
                </div>
                </div>
            </div>

        </div>
    );
}
