import { Component } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer, Marker, InfoWindow, BicyclingLayer } from '@react-google-maps/api';
import './mapcomponent.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

class Directions extends Component {
    constructor(props) {
        super(props)

        this.addLocationToOrigin = this.addLocationToOrigin.bind(this);
        this.addLocationToDestination = this.addLocationToDestination.bind(this);

        this.state = {
            response: null,
            travelMode: 'BICYCLING',
            origin: '',
            destination: '',
            showInfoWindow: false,
        }
        this.startJourney = this.startJourney.bind(this);
        this.directionsCallback = this.directionsCallback.bind(this);
        this.handleOriginChange = this.handleOriginChange.bind(this);
        this.handleDestinationChange = this.handleDestinationChange.bind(this);
        this.onMapClick = this.onMapClick.bind(this);
        this.addLocationToOrigin = this.addLocationToOrigin.bind(this);
        this.addLocationToDestination = this.addLocationToDestination.bind(this);
        this.onInfoWindowClose = this.onInfoWindowClose.bind(this);
    }

    directionsCallback(response) {
        console.log(response)

        if (response !== null) {
            if (response.status === 'OK') {
                this.setState(
                    () => ({
                        response,
                        distance: response.routes[0].legs[0].distance.text,
                        duration: response.routes[0].legs[0].duration.text
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
                        this.setState({
                            clickedLocation,
                            locationName,
                            origin: locationName,
                        });
                    }
                });
            });
        }
    };


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
        const mapoptions = {
            streetViewControl: false, // Disable street view control
            fullscreenControl: false,
        };
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
            
            height:'80%',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '10px',
            borderRadius: '4px',
        };
        return (
            <div className='map z-15 ' style={containerStyle}>

                <div className='map-container rounded-sm border-x-2'>
                    
                    <GoogleMap
                        onClick={this.onMapClick}
                        // required
                        id='direction-example'
                        // required
                        mapContainerStyle={mapStyle}
                        // required
                        zoom={15}
                        // required
                        center={{
                            lat: 22.288842057543526,
                            lng: 73.36342271477237
                        }}
                        options={mapoptions}
                        // optional
                        // optional
                        onLoad={map => {
                            console.log('DirectionsRenderer onLoad map: ', map)
                        }}
                        // optional
                        onUnmount={map => {
                            console.log('DirectionsRenderer onUnmount map: ', map)
                        }}
                    ><BicyclingLayer />

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
                                        panel: document.getElementById('journey-info')
                                        // You can customize other options as needed
                                    }}
                                />
                            ))}

                    </GoogleMap>
                    {this.state.journeyStarted && (
                        <div className="journey-info" id="journey-info">
                            <p>Your journey has started!</p>
                        </div>
                    )}
                    <div className='absolute flex flex-cols justify-center h-screen items-center'>
                    <div style={overlayStyle}>
                    <div className='max-w-fit grid gril-rows-2 items-center'>
                        <h3 className='w-100 h-10 text-center items-center bg-red-500 text-white block bold border-2 border-amber-400 ...'>Parul Navigation</h3>

                        <div className='justify-center align-center items-center content-center'>
                            <div className="map-settings p-4 bg-blue-500 rounded-b-sm text-white border-y-2 border-x-2 border-amber-200 grid grid-rows-3">
                                <div className=' rounded border ... mb-4'>
                                    <div className=''>
                                        <div className='text-gray-500 w-100'>
                                            <div className=" flex p-2 ">
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

                                            <div className="mb-4 flex p-2">
                                                <input
                                                    id="DESTINATION"
                                                    className="form-input mt-1 block w-full rounded-sm"
                                                    type="text"
                                                    value={this.state.destination}
                                                    onChange={this.handleDestinationChange}
                                                    placeholder='Destination...'
                                                />&nbsp;
                                                <div className="rounded text-white">
                                                    <div onClick={this.handleCurrentLocation}>
                                                        <button>
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

                                <div className="grid grid-cols-4 rounded m-4 border text-white ...">
                                    {/* MAKE it Active! */}
                                    <button class={`form-radio ${this.state.travelMode === 'DRIVING' ? 'active' : ''}  hover:bg-blue-400  font-bold rounded-l`} onClick={() => this.handleTravelModeChange('DRIVING')}>
                                        <i class="fa-solid fa-car"></i> Driving
                                    </button>
                                    <button class={`form-radio ${this.state.travelMode === 'BICYCLING' ? 'active' : ''}  hover:bg-blue-400  font-bold`} onClick={() => this.handleTravelModeChange('BICYCLING')}>
                                        <i class="fa-solid fa-bicycle"></i> Bicycling
                                    </button>
                                    <button class={`form-radio ${this.state.travelMode === 'TRANSIT' ? 'active' : ''}  hover:bg-blue-400  font-bold`} onClick={() => this.handleTravelModeChange('TRANSIT')}>
                                        <i class="fa-solid fa-bus"></i> Transit
                                    </button>
                                    <button class={`form-radio ${this.state.travelMode === 'WALKING' ? 'active' : ''}  hover:bg-blue-400  font-bold rounded-r`} onClick={() => this.handleTravelModeChange('WALKING')}>
                                        <i class="fa-solid fa-person-walking"></i> Walking
                                    </button>
                                </div>
                                <div className="map-settings p-4 bg-blue-500 rounded-b-sm text-white border-y-2 border-x-2 border-amber-200 ">
                                    <div className='grid grid-cols-2   rounded border ...'>
                                        <p>Distance: <br />{this.state.distance}</p>
                                        <p>Duration: <br />{this.state.duration}</p>
                                    </div>
                                    <br />
                                    <button onClick={this.startJourney} className='p-4 hover:bg-blue-400 font-bold rounded'>Start Journey</button>
                                </div>

                            </div>
                        </div>

                    </div>
                    </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default Directions