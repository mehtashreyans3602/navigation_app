import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer, Marker, InfoWindow, BicyclingLayer, KmlLayer, TrafficLayer, TransitLayer, Circle } from '@react-google-maps/api';
import './Map.css';

const MobileMap = () => {
    const [response, setResponse] = useState(null);
    const [travelMode, setTravelMode] = useState('WALKING');
    const [destination, setDestination] = useState('');
    const [showInfoWindow, setShowInfoWindow] = useState(false);
    const [remainingTime, setRemainingTime] = useState(null);
    const [showLabels, setShowLabels] = useState(true);
    const [mapOptions, setMapOptions] = useState({
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
        zoomControl: false,
    });
    const [clickedLocation, setClickedLocation] = useState(null);
    const [infoWindowPosition, setInfoWindowPosition] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [journeyStarted, setJourneyStarted] = useState(false);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const containerStyle = {
        position: 'relative',
        width: '100%',
        height: '400px',
    };

    const mapStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        tilt: 45,
    };

    const overlayStyle = {
        position: 'relative',
        height: '80%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '10px',
        borderRadius: '4px',
    };

    useEffect(() => {
        showCurrentLocationMarker();
    }, []);

    const showCurrentLocationMarker = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                const currentLocation = { lat: latitude, lng: longitude };
                setCurrentLocation(currentLocation);
                setClickedLocation(currentLocation);
                setDestination('');
            });
        }
    };

    const directionsCallback = (response) => {
        console.log(response);

        if (response !== null) {
            if (response.status === 'OK') {
                const duration = response.routes[0].legs[0].duration.text;
                setResponse(response);
                setRemainingTime(response.routes[0].legs[0].duration.text);
                setDuration(response.routes[0].legs[0].duration.text);
                setDistance(response.routes[0].legs[0].distance.text);
            } else {
                console.log('response: ', response);
            }
        }
    };

    const handleDestinationChange = (event) => {
        setDestination(event.target.value);
    };

    const onMapClick = (e) => {
        setClickedLocation(e.latLng);
        setInfoWindowPosition(e.latLng);
    };

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const clickedLocation = { lat: latitude, lng: longitude };
                    const geocoder = new window.google.maps.Geocoder();
                    geocoder.geocode({ location: clickedLocation }, (results, status) => {
                        if (status === 'OK') {
                            const locationName = results[0]?.formatted_address || '';
                            showCurrentLocationMarker();
                            setClickedLocation(clickedLocation);
                            const circleOptions = {
                                center: clickedLocation,
                                radius: 1000,
                                fillColor: '#00FF00',
                                strokeColor: '#00FF00',
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                            };
                            const circle = new window.google.maps.Circle(circleOptions);
                            circle.setMap(null); // Remove the previous circle
                            circle.setMap(GoogleMap.current);
                        } else {
                            console.error('Geocode request failed. Status:', status);
                        }
                    });
                },
                (error) => {
                    console.error('Error getting current position:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };

    const handleInfoWindowClose = () => {
        setShowInfoWindow(false);
    };

    const handleToggleLabels = () => {
        setShowLabels(!showLabels);
    };

    const handleMapOptionsChange = (option, value) => {
        setMapOptions((prevOptions) => ({
            ...prevOptions,
            [option]: value,
        }));
    };

    const handleStartJourney = () => {
        setJourneyStarted(true);
    };

    const onInfoWindowClose = () => {
        setInfoWindowPosition(null);
    };

    const handleReset = () => {
        setDestination('');
        setResponse(null);
        setShowInfoWindow(false);
        setRemainingTime(null);
        setShowLabels(true);
        setClickedLocation(null);
        setInfoWindowPosition(null);
        setJourneyStarted(false);
        setDistance(null);
        setDuration(null);
    };

    const AddLocationToDestination = ({ clickedLocation }) => {
        setDestination(clickedLocation);
    };

    return (
        <div className='map' style={containerStyle}>
            <div className='' style={overlayStyle}>
                <LoadScript googleMapsApiKey='AIzaSyAmO6igvLr3ZDNr0OW3F9PNMYeQl28HGzI'>
                    <GoogleMap
                        mapContainerStyle={mapStyle}
                        zoom={13}
                        center={currentLocation}
                        options={mapOptions}
                        onClick={onMapClick}
                    >
                        {currentLocation && (
                            <Circle position={currentLocation} options={{
                                radius: 1000,
                                fillColor: '#00FF00',
                                strokeColor: '#00FF00',
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                                zIndex: 9999,
                            }} />
                        )}

                        {clickedLocation && (
                            <Marker position={clickedLocation} icon="https://maps.google.com/mapfiles/ms/icons/red-dot.png" />
                        )}

                        {showInfoWindow && (
                            <InfoWindow position={infoWindowPosition} onCloseClick={handleInfoWindowClose}>
                                <div>
                                    <h3>Clicked Location</h3>
                                    <p>Lat: {clickedLocation.lat()}, Lng: {clickedLocation.lng()}</p>
                                </div>
                            </InfoWindow>
                        )}

                        {response && (
                            <DirectionsRenderer
                                directions={response}
                                options={{
                                    suppressMarkers: false,

                                }}
                            />
                        )}
                        <TrafficLayer autoUpdate >

                        </TrafficLayer>
                        <DirectionsService autoUpdate
                            options={{
                                destination,
                                origin: currentLocation, // Set current location as the origin
                                travelMode,
                                provideRouteAlternatives: true,
                            }}
                            callback={directionsCallback}
                        />
                        <BicyclingLayer />
                        <KmlLayer url="https://www.example.com/your.kml" />
                        <TransitLayer />

                        {infoWindowPosition && (
                            <InfoWindow position={infoWindowPosition} onCloseClick={onInfoWindowClose}>
                                <div>
                                    <button onClick={() => AddLocationToDestination({ clickedLocation: infoWindowPosition })}>
                                        Add to Destination
                                    </button>
                                </div>
                            </InfoWindow>
                        )}

                        {journeyStarted && remainingTime && (
                            <div className="timer-container">
                                <span className="timer">{remainingTime}</span>
                            </div>
                        )}
                        <div onClick={handleCurrentLocation} className='fixed right-2 bottom-20  text-black hover:scale-100'>
                            <button>
                                <i className="fas fa-compass"></i>
                            </button>
                        </div>

                    </GoogleMap>
                </LoadScript>
                <div className='sticky top-0 justify-center items-center '>
                    <div className='w-full  items-center justify-center '>
                        <div className='sticky flex flex-col justify-around  ... ' style={{ backgroundColor: '#3E3E3EA3', color: '#E7BDB9' }}>
                            <div className='w-full text-center'>
                                <div className="flex p-2 items-center ">

                                    <input
                                        id="DESTINATION"
                                        className="form-input w-full rounded-sm bg-transparent text-white"
                                        type="text"
                                        value={destination}
                                        onChange={handleDestinationChange}
                                        placeholder=' Destination...'
                                    />

                                </div>
                            </div>


                            {handleDestinationChange && (
                                <div className=" grid grid-cols-2 p-2">
                                <button className=" bg-neutral-500 rounded-full font-bold p-2 m-1 " onClick={handleReset}>
                                    Reset
                                </button>
                                <button onClick={handleStartJourney} className=' bg-neutral-500 rounded-full font-bold p-2 m-1'>
                                    Start Journey
                                </button>
                            </div>
                            )}

                            {journeyStarted && (<div className="p-2">
                                <div className="items-center">
                                    <div className='grid grid-cols-2 align-middle text-center rounded ...'>
                                        <p>Distance: {distance}</p>
                                        <p>Duration: {duration}</p>
                                    </div>
                                </div>
                            </div>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileMap;
