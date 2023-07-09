import Img from '../assets/SC.png'
import Marquee from 'react-fast-marquee';
const places = ["PU Circle", "PIET", "PIT", "PIAR", "PPI", "PIMSR", "PIAS", "PIP", "JNHM", "PIN"];

export default () => {

    return (
        <>
            {places.map((place, index) => (

                <a href="#" style={{ color: '#E7BDB9' }} className="grid grid-cols-1 p-2 ml-1 items-center hover:border hover:border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl  dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <div className="flex flex-col justify-between p-2 leading-normal text-center">
                        <img style={{ maxWidth: '105px' }} className="object-fit rounded-lg" src={Img} alt="" />
                        <Marquee style={{ maxWidth: '105px' }}>
                            <h5 className="">{place}</h5>
                        </Marquee>
                    </div>
                </a>

            ))}
        </>
    )
}