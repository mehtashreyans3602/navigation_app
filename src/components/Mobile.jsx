"use client"
import { Component } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer, Marker, InfoWindow, BicyclingLayer, KmlLayer, TrafficLayer, TransitLayer, Circle } from '@react-google-maps/api';
import './mapcomponent.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

class MobileDirections extends Component {
    constructor(props) {
        super(props)

        this.addLocationToOrigin = this.addLocationToOrigin.bind(this);
        this.addLocationToDestination = this.addLocationToDestination.bind(this);
        this.state = {
            response: null,
            travelMode: null,
            origin: '',
            destination: '',
            showInfoWindow: false,
            remainingTime: null,
            showLabels: true,
            mapOptions: {
                streetViewControl: false,
                fullscreenControl: false,
                mapTypeControl: false, // Disable default map type controls

            },
        }
        this.startJourney = this.startJourney.bind(this);
        this.directionsCallback = this.directionsCallback.bind(this);
        this.handleOriginChange = this.handleOriginChange.bind(this);
        this.handleDestinationChange = this.handleDestinationChange.bind(this);
        this.onMapClick = this.onMapClick.bind(this);
        this.addLocationToOrigin = this.addLocationToOrigin.bind(this);
        this.addLocationToDestination = this.addLocationToDestination.bind(this);
        this.onInfoWindowClose = this.onInfoWindowClose.bind(this);
        this.showCurrentLocationMarker = this.showCurrentLocationMarker.bind(this);
    }

    showCurrentLocationMarker() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                const currentLocation = { lat: latitude, lng: longitude };

                // Render a marker on the map at the current location
                return <Marker position={currentLocation} />;
            });
        }
    }


    directionsCallback(response) {
        console.log(response)

        if (response !== null) {
            if (response.status === 'OK') {
                const duration = response.routes[0].legs[0].duration.text;
                const remainingTime = duration;
                this.setState(
                    () => ({

                        response,
                        distance: response.routes[0].legs[0].distance.text,
                        duration: response.routes[0].legs[0].duration.text,
                        remainingTime,
                    })
                )
            } else {
                console.log('response: ', response)
            }
        }
    }

    handleTravelModeChange = (travelMode) => {
        this.setState({
            travelMode
        });
    }

    handleSwapLocations = () => {
        this.setState(prevState => ({
            origin: prevState.destination,
            destination: prevState.origin,
        }));
    };

    handleOriginChange(event) {
        this.setState({ origin: event.target.value });
    }

    handleDestinationChange(event) {
        this.setState({ destination: event.target.value });
    }
    onMapClick = (e) => {
        this.setState({
            clickedLocation: e.latLng,
            infoWindowPosition: e.latLng,
        });
    };


    handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                const clickedLocation = { lat: latitude, lng: longitude };
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ location: clickedLocation }, (results, status) => {
                    if (status === 'OK') {
                        const locationName = results[0]?.formatted_address || '';
                        this.showCurrentLocationMarker()
                        this.setState({
                            clickedLocation,
                            locationName,
                            origin: locationName,
                        });

                        // Add the circle code here
                        const circleOptions = {
                            center: clickedLocation,
                            radius: 1000, // Specify the radius in meters
                            fillColor: 'blue',
                        };

                        const circle = new window.google.maps.Circle(circleOptions);

                        // Set the circle on the map
                        if (this.map) {
                            circle.setMap(this.map);
                        }
                    }
                });
            });
        }
    };
    componentDidMount() {
        // Show the current location marker when the component mounts
        this.showCurrentLocationMarker();
    }

    showCurrentLocationMarker() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                const currentLocation = { lat: latitude, lng: longitude };

                this.setState({ currentLocation });
            });
        }
    }


    addLocationToOrigin() {
        if (this.state.clickedLocation) {
            const { lat, lng } = this.state.clickedLocation;
            const origin = `${lat},${lng}`;

            // Perform reverse geocoding to get the location name
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: this.state.clickedLocation }, (results, status) => {
                if (status === 'OK') {
                    const locationName = results[0]?.formatted_address || origin;
                    this.setState(() => ({
                        origin: locationName,
                    }));
                } else {
                    this.setState(() => ({
                        origin,
                    }));
                }
            });
        }
    }

    addLocationToDestination() {
        if (this.state.clickedLocation) {
            const { lat, lng } = this.state.clickedLocation;
            const destination = `${lat},${lng}`;

            // Perform reverse geocoding to get the location name
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: this.state.clickedLocation }, (results, status) => {
                if (status === 'OK') {
                    const locationName = results[0]?.formatted_address || destination;
                    this.setState(() => ({
                        destination: locationName,
                    }));
                } else {
                    this.setState(() => ({
                        destination,
                    }));
                }
            });
        }
    }


    onInfoWindowClose = () => {
        this.setState({ infoWindowPosition: null });
    };

    startJourney() {
        this.setState({ journeyStarted: true });
    }

    render() {

        const containerStyle = {
            position: 'relative',
            width: '100%',
            height: '400px',
        };

        const mapStyle = {
            width: '100%',
            height: '65vh',
        };

        const overlayStyle = {
            position: 'relative',

            height: '80%',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '10px',
            borderRadius: '4px',
        };



        const toggleSatelliteView = () => {
            this.setState(prevState => ({
                mapOptions: {
                    ...prevState.mapOptions,
                    mapTypeId:
                        prevState.mapOptions.mapTypeId === 'satellite'
                            ? 'roadmap'
                            : prevState.mapOptions.mapTypeId === 'roadmap'
                                ? 'terrain'
                                : prevState.mapOptions.mapTypeId === 'terrain'
                                    ? 'hybrid'
                                    : 'satellite',
                },
            }));
        };
        const toggleMapLabels = () => {
            this.setState(prevState => ({
                mapOptions: {
                    ...prevState.mapOptions,
                    styles: prevState.mapOptions.styles && prevState.mapOptions.styles.length === 0 ? [{ featureType: 'all', elementType: 'labels', stylers: [{ visibility: 'off' }] }] : [],
                },
            }));
        };

        return (
            <div className='map z-15 justify-center items-center flex '>

                <div className='flex flex-cols rounded-sm border-x-2'>
                    <div className='justify-center items-center'>
                        <div className=''>
                            <div className='grid items-center border-2 bg-black'>
                                <h3 className='w-100 h-10 text-center items-center block p-2 ...' style={{ backgroundColor: '#3E3E3EA3', color: '#E7BDB9' }}>PU NAV</h3>

                                <div className='justify-center align-center items-center content-center'>
                                    <div style={{ backgroundColor: '#3E3E3EA3', color: '#E7BDB9' }} className="map-settings rounded-b-sm  ">
                                        <div className=' rounded border ... m-1'>
                                            <div className=''>
                                                <div className='text-gray-500 w-100'>
                                                    <div className=" flex m-1">
                                                        <input
                                                            id="ORIGIN"
                                                            className="form-input mt-1 block w-full rounded-sm"
                                                            type="text"
                                                            value={this.state.origin}
                                                            onChange={this.handleOriginChange}
                                                            placeholder='Origin...'
                                                        />
                                                        <div className="rounded text-white pl-1">
                                                            <div onClick={this.handleCurrentLocation}>
                                                                <button>
                                                                    <i className="fas fa-compass"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className=" flex m-1">
                                                        <input
                                                            id="DESTINATION"
                                                            className="form-input mt-1 block w-full rounded-sm"
                                                            type="text"
                                                            value={this.state.destination}
                                                            onChange={this.handleDestinationChange}
                                                            placeholder='Destination...'
                                                        />&nbsp;
                                                        <div className="rounded text-white">
                                                            <div >
                                                                <button onClick={this.handleSwapLocations}>
                                                                    <i class="fas fa-exchange-alt fa-rotate-90"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>

                                                </div>

                                            </div>

                                        </div>

                                        <div className="grid grid-cols-3 rounded border m-1 ...">
                                            {/* MAKE it Active! */}
                                            <button class={`form-radio ${this.state.travelMode === 'BICYCLING' ? 'active' : ''}  hover:bg-white  font-bold`} onClick={() => this.handleTravelModeChange('BICYCLING')}>
                                                <i class="fa-solid fa-bicycle"></i><br />Bicycling
                                            </button>
                                            <button class={`form-radio ${this.state.travelMode === 'WALKING' ? 'active' : ''}  hover:bg-white  font-bold `} onClick={() => this.handleTravelModeChange('WALKING')}>
                                                <i class="fa-solid fa-person-walking"></i><br />Walking
                                            </button>
                                            <button onClick={this.startJourney} className='p-1 hover:bg-white font-bold rounded-r'>Start Journey</button>
                            
                                        </div>

                                        <div className="map-options grid grid-cols-2 rounded border m-1">
                                            <button className='p-1 hover:bg-white font-bold rounded-l' onClick={toggleMapLabels}>Labels</button>
                                            <button className='p-1 hover:bg-white font-bold rounded-r' onClick={toggleSatelliteView}>Map Type</button>
                                        </div>


                                    </div>
                                </div>
                                <div style={{ color: '#E7BDB9' }}  className=' flex bg-black'>
                        <div style={{ backgroundColor: '#3E3E3EA3', color: '#E7BDB9' }}  className="map-settings p-1 rounded-b-sm text-whiteflex flex-col ">
                            <div className='grid grid-cols-3 justify-between p-1  rounded border ...'>
                                <p>Distance: <br />{this.state.distance}</p>
                                <p>Duration: <br />{this.state.duration}</p>
                                <p>Remaining Time:<br />
                                    {this.state.remainingTime}</p>
                            </div>
                            <br />
                            {this.state.journeyStarted && (
                                <div className="journey-info" id="journey-info">
                                    <p>Your journey has started!</p>
                                </div>
                            )}
                        </div>
                        </div>
                            </div>
                        </div>


                        <LoadScript googleMapsApiKey='AIzaSyAmO6igvLr3ZDNr0OW3F9PNMYeQl28HGzI'>
                            <GoogleMap
                                onClick={this.onMapClick}
                                // required
                                id='direction-example'
                                // required
                                mapContainerStyle={mapStyle}
                                // required
                                zoom={18}
                                // required
                                center={{
                                    lat: 22.288842057543526,
                                    lng: 73.36342271477237
                                }}
                                options={this.state.mapOptions}
                                // optional
                                // optional
                                onLoad={map => {
                                    console.log('DirectionsRenderer onLoad map: ', map)
                                }}
                                // optional
                                onUnmount={map => {
                                    console.log('DirectionsRenderer onUnmount map: ', map)
                                }}
                            >

                                <TransitLayer />
                                <TrafficLayer></TrafficLayer>
                                <KmlLayer url="http://googlemaps.github.io/js-v2-samples/ggeoxml/cta.kml" />
                                <BicyclingLayer />
                                {this.state.infoWindowPosition && (
                                    <InfoWindow
                                        position={this.state.infoWindowPosition}
                                        onCloseClick={this.onInfoWindowClose}
                                    >
                                        <div>
                                            <button onClick={this.addLocationToOrigin}>Add to Origin</button>
                                            <br />
                                            <button onClick={this.addLocationToDestination}>Add to Destination</button>
                                        </div>
                                    </InfoWindow>
                                )}

                                {
                                    (
                                        this.state.destination !== '' &&
                                        this.state.origin !== ''
                                    ) && (
                                        <DirectionsService
                                            // required
                                            options={{
                                                destination: this.state.destination,
                                                origin: this.state.origin,
                                                travelMode: this.state.travelMode
                                            }}
                                            // required
                                            callback={this.directionsCallback}
                                            // optional
                                            onLoad={directionsService => {
                                                console.log('DirectionsService onLoad directionsService: ', directionsService)
                                            }}
                                            // optional
                                            onUnmount={directionsService => {
                                                console.log('DirectionsService onUnmount directionsService: ', directionsService)
                                            }}
                                        />
                                    )
                                }

                                {this.state.response !== null &&
                                    this.state.response.routes.map((route, index) => (
                                        <DirectionsRenderer
                                            key={index}
                                            options={{
                                                directions: this.state.response,
                                                routeIndex: index,
                                                // panel: document.getElementById('journey-info')
                                                // You can customize other options as needed
                                            }}
                                        />
                                    ))}
                                {this.state.currentLocation && (
                                    <Marker position={this.state.currentLocation} />
                                )}
                            </GoogleMap>
                        </LoadScript>
                        

                    </div>
                </div>
            </div>
        )
    }
}

export default MobileDirections