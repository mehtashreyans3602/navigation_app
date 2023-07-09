import '@fortawesome/fontawesome-free/css/all.min.css';
import Img from '../assets/SC.png'
import Marquee from 'react-fast-marquee';
import { useState } from 'react';
const places = ["PU Circle", "PIET", "PIT", "PIAR", "PPI", "PIMSR", "PIAS", "PIP", "JNHM", "PIN"];

export default () => {
    const [openPanel,setOpenPanel] = useState(false);
    const [openPanel2,setOpenPanel2] = useState(false);
    
    function handlePanel(){
        setOpenPanel2(false)
        setOpenPanel(!openPanel)
    }
    function handlePanel2(){
        setOpenPanel(false)
        setOpenPanel2(!openPanel2)
    }
    return (
        <div className="bottom-0 grid grid-flow-row rounded-t-3xl " style={{ backgroundColor: '#3E3E3EA3', color: '#E7BDB9' }}>
            <div className="sticky top-0 text-center flex justify-around  p-1 rounded-3xl">
                <button className="text-xl" onClick={handlePanel}><i class="fa-solid fa-map"></i>&nbsp;Places</button>
                <button className="text-xl" onClick={handlePanel2}><i class="fa-solid fa-map"></i>&nbsp;Events</button>
                
            </div>
            <div className="relative side-panel p-1 flex flex-row overflow-x-auto" style={{ maxWidth: '50vh' }}>
                {openPanel && (
                    <div className='flex flex-row'>
                    {places.map((place, index) => (
                        <a href="#" style={{ color: '#E7BDB9' }} className=" ml-1 items-center hover:border hover:border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl  dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                            <div className="flex flex-col justify-between p-2 leading-normal text-center">
                                <img style={{ maxWidth: '55px' }} className="object-fit rounded-full" src={Img} alt="" />
                                <Marquee style={{ maxWidth: '65px' }}>
                                    <h5 className="">{place}</h5>
                                </Marquee>
                            </div>
                        </a>
                    ))}
                    </div>
                )}
                {openPanel2 && (
                    <div className='flex flex-row'>
                    {places.map((place, index) => (
                        <a href="#" style={{ color: '#E7BDB9' }} className=" ml-1 items-center hover:border hover:border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl  dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                            <div className="flex flex-col justify-between p-2 leading-normal text-center">
                                <img style={{ maxWidth: '55px' }} className="object-fit rounded-full" src={Img} alt="" />
                                <Marquee style={{ maxWidth: '65px' }}>
                                    <h5 className="">{place}</h5>
                                </Marquee>
                            </div>
                        </a>
                    ))}
                    </div>
                )}

            </div>
        </div>


    );
}
