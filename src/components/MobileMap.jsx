"use client"
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer, Marker, InfoWindow, BicyclingLayer, KmlLayer, TrafficLayer, TransitLayer, Circle } from '@react-google-maps/api';
import './Map.css'
const MobileMap = (props) => {
    const [response, setResponse] = useState(null);
    const [travelMode, setTravelMode] = useState('');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [showInfoWindow, setShowInfoWindow] = useState(false);
    const [remainingTime, setRemainingTime] = useState(null);
    const [showLabels, setShowLabels] = useState(true);
    const [mapOptions, setMapOptions] = useState({
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
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
    };

    const overlayStyle = {
        position: 'relative',
        height: '80%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '10px',
        borderRadius: '4px',
    };
    useEffect(() => {
        // Show the current location marker when the component mounts
        showCurrentLocationMarker();
    }, []);

    const showCurrentLocationMarker = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                const currentLocation = { lat: latitude, lng: longitude };
                setCurrentLocation(currentLocation);
            });
        }
    };

    const directionsCallback = (response) => {
        console.log(response);

        if (response !== null) {
            if (response.status === 'OK') {
                const duration = response.routes[0].legs[0].duration.text;
                const remainingTime = duration;
                setResponse(response);
                setRemainingTime(remainingTime);
                setDuration(response.routes[0].legs[0].duration.text);
                setDistance(response.routes[0].legs[0].distance.text);
            } else {
                console.log('response: ', response);
            }
        }
    };



    const handleSwapLocations = () => {
        setOrigin(destination);
        setDestination(origin);
    };

    const handleOriginChange = (event) => {
        setOrigin(event.target.value);
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
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                const clickedLocation = { lat: latitude, lng: longitude };
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ location: clickedLocation }, (results, status) => {
                    if (status === 'OK') {
                        const locationName = results[0]?.formatted_address || '';
                        showCurrentLocationMarker();
                        setClickedLocation(clickedLocation);
                        setOrigin(locationName);

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
            }, (error) => {
                console.error('Error getting current position:', error);
            });
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



    const AddLocationToOrigin = ({ clickedLocation }) => {
        setOrigin(clickedLocation)
    };

    const AddLocationToDestination = ({ clickedLocation }) => {
        setDestination(clickedLocation)
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
                            <Marker position={currentLocation} icon="https://maps.google.com/mapfiles/ms/icons/blue-dot.png" />
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
                                    suppressMarkers: true,
                                    polylineOptions: {
                                        strokeColor: journeyStarted ? '#FF0000' : '#0000FF',
                                    },
                                }}
                            />
                        )}
                        <TrafficLayer autoUpdate>

                        </TrafficLayer>
                        <DirectionsService
                            options={{
                                destination,
                                origin,
                                travelMode,
                            }}
                            callback={directionsCallback}
                        />
                        <BicyclingLayer />
                        <KmlLayer url="https://www.example.com/your.kml" />

                        <TransitLayer />
                        {infoWindowPosition && (
                            <InfoWindow position={infoWindowPosition} onCloseClick={onInfoWindowClose}>
                                <div>
                                    <button onClick={() => AddLocationToOrigin({ clickedLocation: infoWindowPosition })}>
                                        Add to Origin
                                    </button>
                                    <br />
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
                    </GoogleMap>
                </LoadScript>
                <div className='sticky  justify-center items-center mt-2'>

                    <div className='w-full rounded-2xl items-center justify-center bg-black'>
                        <div className='sticky flex flex-col justify-around rounded-2xl  ...' style={{ backgroundColor: '#3E3E3EA3', color: '#E7BDB9' }} >
                            <div className='flex'>
                                <div className="flex p-2 items-center">
                                    <input
                                        id="ORIGIN"
                                        className="form-input mt-1  w-full rounded-lg"
                                        type="text"
                                        value={origin}
                                        onChange={handleOriginChange}
                                        placeholder=' Origin...'

                                    />
                                    <div className="rounded  pl-1">
                                        <div onClick={handleCurrentLocation}>
                                            <button>
                                                <i className="fas fa-compass"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex p-2 items-center">
                                    <input
                                        id="DESTINATION"
                                        className="form-input mt-1  w-full rounded-lg"
                                        type="text"
                                        value={destination}
                                        onChange={handleDestinationChange}
                                        placeholder=' Destination...'

                                    />&nbsp;
                                    <div className="rounded ">
                                        <div >
                                            <button onClick={handleSwapLocations}>
                                                <i class="fas fa-exchange-alt fa-rotate-90"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div>

                            </div>
                            <div className="border-l p-2 flex place-items-center justify-between" >


                                <div className="">
                                    <label>Map Type:&nbsp;</label>
                                    <select className='' onChange={(e) => handleMapOptionsChange('mapTypeId', e.target.value)}>
                                        <option value="roadmap">Roadmap</option>
                                        <option value="satellite">Satellite</option>
                                        <option value="terrain">Terrain</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                </div>
                                <div className="p-2 w-100 flex items-center align-middle">
                                <label>Zoom:&nbsp;</label>
                                    <div className="">
                                        <input
                                            type="range"
                                            min={0}
                                            max={20}
                                            step={1}
                                            value={mapOptions.zoom}
                                            onChange={(e) => handleMapOptionsChange('zoom', parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>


                            <div className="border-l grid grid-cols-3"  >
                                {/* MAKE it Active! */}
                                <button class={`form-radio ${travelMode === 'BICYCLING' ? 'active' : ''} m-1 p-1 panelbutton  hover:bg-white  font-bold rounded-2xl`} onClick={() => setTravelMode('BICYCLING')}>
                                    <i class="fa-solid fa-bicycle"></i> Bicycling
                                </button>
                                <button class={`form-radio ${travelMode === 'WALKING' ? 'active' : ''} m-1 p-1 panelbutton  hover:bg-white  font-bold rounded-2xl`} onClick={() => setTravelMode('WALKING')} >
                                    <i class="fa-solid fa-person-walking"></i> Walking
                                </button>
                                <div className=" "  >
                                <button onClick={handleStartJourney} className='mt-1 p-4 hover:bg-white font-bold rounded'>Start Journey</button>
                            </div>
                            </div>
                            
                            <div className="border-l p-2"  >
                                <div className=" items-center">
                                    <div className='grid grid-cols-2 align-middle text-center   rounded ...'>
                                        <p>Distance: {distance}</p>
                                        <p>Duration: {duration}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileMap;

