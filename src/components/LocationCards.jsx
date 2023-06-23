import Img from '../assets/SC.png'
const places = ["Parul University", "PIET", "PIT", "PPI", "PIMS", "PIAS", "PIP", "JNIM"];

export default () => {
    
    return (
        <>
        {places.map((place, index) => (
            
<a href="#" className="grid grid-cols-1 p-4 m-1 items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
    <div className="flex flex-col justify-between p-4 leading-normal text-center">
    <img className="object-fit w-full rounded-lg max-h-24 md:h-auto md:w-auto " src={Img} alt=""/>
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{place}</h5>
    </div>
    
    
</a>

        ))}
        </>
    )
}