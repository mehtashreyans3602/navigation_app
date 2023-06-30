import '@fortawesome/fontawesome-free/css/all.min.css';
import Img from '../assets/SC.png'
import { useState } from 'react';
const places = ["PU Talks", "Dhoom-23","Sports"];
export default () => {
    const [OpenEvent,setOpenEvent] = useState(false);
    return (<div className=''>
        <div className="absolute  right-0 transform -translate-y-1/3 backdrop-blur-sm rounded-l-3xl "style={{backgroundColor:'#E7BDB9',color:'#410005'}}>
            <div className="relative">
                <div className="sticky top-0 right-0 text-center  m-2 p-4 rounded-3xl">
                    <h1 className="text-3xl"><i class="fa-solid fa-calendar"></i>&nbsp;Live Events</h1>
                </div>
                <div className="relative side-panel  left-0 flex flex-col overflow-y-auto" style={{ maxHeight: '50vh' }}>
                {places.map((place, index) => (
            
            <div onClick={() => (setOpenEvent(!OpenEvent))}  style={{backgroundColor:'#FFDEA7',color:'#775654',maxWidth:'240px'}} className="justify-center items-center py-1 m-1  border hover:border-white rounded-lg shadow ">
                    <div style={{Height:'224px',maxWidth:'240px'}}>
                        <div>
                        <div className="flex text-white items-center justify-center">
                            <img style={{maxHeight:'120px',color:'#775654'}} className="w-full m-2 rounded-lg border-2 border-current " src={Img} alt=""/>
                        </div>
                        </div>
                        <div className='m-2'>   
                            <h5 style={{color:'#775654'}} className="mb-2 text-2xl  tracking-tight text-gray-900 dark:text-white">{place}</h5>
                            <p className='text-sm'>Location:</p>
                            <p className='text-sm'>Time:</p>
                        </div>
                    </div>    
            </div>
            
                    ))}
                </div>
                <div>
                <div className="sticky top-0 right-0 text-center text-white m-2 p-4 rounded-3xl">  
                </div>
                </div>
            </div>
        </div>
        
        </div>
    );
}
