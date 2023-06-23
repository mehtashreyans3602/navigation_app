import '@fortawesome/fontawesome-free/css/all.min.css';

const places = ["Parul University", "PIET", "PIT", "PPI", "PIMS", "PIAS", "PIP", "JNIM"];

export default () => {
    return (
        <div className="absolute right-0 transform -translate-y-1/3 backdrop-blur-sm rounded-l-3xl "style={{backgroundColor:'#E7BDB9',color:'#410005'}}>
            <div className="relative">
                <div className="sticky top-0 right-0 text-center  m-2 p-4 rounded-3xl">
                    <h1 className="text-3xl"><i class="fa-solid fa-car"></i>&nbsp;Live Events</h1>
                </div>
                <div className="relative side-panel  left-0 flex flex-col overflow-y-auto" style={{ maxHeight: '50vh' }}>
                    {places.map((place, index) => (
                        <div key={index} className="p-4">
                            <a
                                href="#"
                                className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{place}</h5>
                                <p className="font-normal text-gray-700 dark:text-gray-400">
                                    Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
                                </p>
                            </a>
                        </div>
                    ))}
                </div>
                <div>
                <div className="sticky top-0 right-0 text-center text-white m-2 p-4 rounded-3xl">
                    
                </div>
                </div>
            </div>

        </div>
    );
}
