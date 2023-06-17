import { Component } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer, Marker, InfoWindow } from '@react-google-maps/api';
import './mapcomponent.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

class Directions extends Component {
    constructor(props) {
        super(props)

        this.addLocationToOrigin = this.addLocationToOrigin.bind(this);
        this.addLocationToDestination = this.addLocationToDestination.bind(this);

        this.state = {
            response: null,
            travelMode: 'DRIVING',
            origin: '',
            destination: '',
            showInfoWindow: false,
        }

        this.directionsCallback = this.directionsCallback.bind(this);
        this.checkDriving = this.checkDriving.bind(this);
        this.checkBicycling = this.checkBicycling.bind(this);
        this.checkTransit = this.checkTransit.bind(this);
        this.checkWalking = this.checkWalking.bind(this);
        this.handleOriginChange = this.handleOriginChange.bind(this);
        this.handleDestinationChange = this.handleDestinationChange.bind(this);
        this.onClick = this.onClick.bind(this);
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
                        response
                    })
                )
            } else {
                console.log('response: ', response)
            }
        }
    }

    checkDriving({ target: { checked } }) {
        checked &&
            this.setState(
                () => ({
                    travelMode: 'DRIVING'
                })
            )
    }

    checkBicycling({ target: { checked } }) {
        checked &&
            this.setState(
                () => ({
                    travelMode: 'BICYCLING'
                })
            )
    }

    checkTransit({ target: { checked } }) {
        checked &&
            this.setState(
                () => ({
                    travelMode: 'TRANSIT'
                })
            )
    }

    checkWalking({ target: { checked } }) {
        checked &&
            this.setState(
                () => ({
                    travelMode: 'WALKING'
                })
            )
    }

    handleOriginChange(event) {
        this.setState({ origin: event.target.value });
    }

    handleDestinationChange(event) {
        this.setState({ destination: event.target.value });
    }


    onClick() {
        if (this.origin.value !== '' && this.destination.value !== '') {
            this.setState(
                () => ({
                    origin: this.origin.value,
                    destination: this.destination.value
                })
            )
        }
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

    render() {
        const infoWindowContent = this.state.showInfoWindow ? (
            <div>
                {this.state.locationName && <p>{this.state.locationName}</p>}
                {!this.state.locationName && (
                    <div>
                        <p>Latitude: {this.state.clickedLocation.lat()}</p>
                        <p>Longitude: {this.state.clickedLocation.lng()}</p>
                    </div>
                )}
                <div>
                    <button onClick={this.addLocationToOrigin}>Add to Origin</button>
                    <button onClick={this.addLocationToDestination}>Add to Destination</button>
                </div>
            </div>
        ) : null;
        const mapoptions = {
            streetViewControl: false, // Disable street view control
            fullscreenControl: false,
        };
        return (
            <div className='map'>
                <div className="map-settings p-4 bg-gray-100">
                    <div className="mb-4">
                        <label htmlFor="ORIGIN" className="block font-medium text-gray-700">Origin</label>
                        <input
                            id="ORIGIN"
                            className="form-input mt-1 block w-full"
                            type="text"
                            value={this.state.origin}
                            onChange={this.handleOriginChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="DESTINATION" className="block font-medium text-gray-700">Destination</label>
                        <input
                            id="DESTINATION"
                            className="form-input mt-1 block w-full"
                            type="text"
                            value={this.state.destination}
                            onChange={this.handleDestinationChange}
                        />
                    </div>

                    <div className="flex flex-wrap mb-4">
                        <div className="mr-4">
                            <input
                                id="DRIVING"
                                className="form-radio"
                                name="travelMode"
                                type="radio"
                                checked={this.state.travelMode === 'DRIVING'}
                                onChange={this.checkDriving}
                            />
                            <label className="ml-2 text-gray-700" htmlFor="DRIVING">Driving</label>
                        </div>

                        <div className="mr-4">
                            <input
                                id="BICYCLING"
                                className="form-radio"
                                name="travelMode"
                                type="radio"
                                checked={this.state.travelMode === 'BICYCLING'}
                                onChange={this.checkBicycling}
                            />
                            <label className="ml-2 text-gray-700" htmlFor="BICYCLING">Bicycling</label>
                        </div>

                        <div className="mr-4">
                            <input
                                id="TRANSIT"
                                className="form-radio"
                                name="travelMode"
                                type="radio"
                                checked={this.state.travelMode === 'TRANSIT'}
                                onChange={this.checkTransit}
                            />
                            <label className="ml-2 text-gray-700" htmlFor="TRANSIT">Transit</label>
                        </div>

                        <div className="mr-4">
                            <input
                                id="WALKING"
                                className="form-radio"
                                name="travelMode"
                                type="radio"
                                checked={this.state.travelMode === 'WALKING'}
                                onChange={this.checkWalking}
                            />
                            <label className="ml-2 text-gray-700" htmlFor="WALKING">Walking</label>
                        </div>
                    </div>

                    <button className="btn btn-primary" type="button" onClick={this.onClick}>
                        Build Route
                    </button>
                </div>


                <div className='map-container'>
                    <GoogleMap
                        onClick={this.onMapClick}
                        // required
                        id='direction-example'
                        // required
                        mapContainerStyle={{
                            height: '400px',
                            width: '100%'
                        }}
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
                    >

                        {this.state.infoWindowPosition && (
                            <InfoWindow
                                position={this.state.infoWindowPosition}
                                onCloseClick={this.onInfoWindowClose}
                            >
                                <div>
                                    <button onClick={this.addLocationToOrigin}>Add to Origin</button>
                                    <br/>
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
                                        // You can customize other options as needed
                                    }}
                                />
                            ))}
                        <div className="pr-10 current-location-control" onClick={this.handleCurrentLocation}>
                            <div className="current-location-button">
                                <i className="fas fa-compass"></i>
                            </div>
                        </div>

                    </GoogleMap>
                </div>
            </div>
        )
    }
}

export default Directions