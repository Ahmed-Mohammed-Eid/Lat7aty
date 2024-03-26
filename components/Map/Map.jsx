import React, {useState, useEffect, useRef} from "react";
import {GoogleMap, Marker, Polygon, InfoWindow} from "@react-google-maps/api";

import axios from "axios";

// SOCKET IO
import {getIo} from "@/Helpers/socket";

const MapContainer = () => {
    // INITIAL CENTER
    const center = {
        lat: 29.3759,
        lng: 47.9774,
    };
    // INITIAL ZOOM
    const zoom = 10;

    // STATES
    const [areas, setAreas] = useState([]);
    const [couriers, setCouriers] = useState([]);
    const [mapCenter, setMapCenter] = useState(center); // Initialize with the initial center
    const [courierLocations, setCourierLocations] = useState([]);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState(null);
    // REFS
    const mapRef = useRef(null);

    const mapContainerStyle = {
        width: "100%",
        height: "600px",
    };


    //EFFECT TO GET THE AREAS
    useEffect(() => {
        //GET THE TOKEN
        const token = localStorage.getItem("token");

        axios.get(`https://api.lathaty.com/api/v1/cached/areas`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => {
                const polygons = res.data.areas.map(area => {
                    return area.polygon.map(point => {
                        return {
                            lat: point.latitude,
                            lng: point.longitude,
                        };
                    });
                })
                setAreas(polygons)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    useEffect(() => {
        const loadMapScript = () => {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.onload = () => setMapLoaded(true);
            document.head.appendChild(script);
        };

        if (typeof window !== "undefined" && !window.google) {
            // Check if the script hasn't been loaded yet
            loadMapScript();
        } else {
            setMapLoaded(true);
        }
    }, []);

    // SOCKET IO
    useEffect(() => {
        const socket = getIo();

        socket.on("couriers_locations", (event) => {
            // GET LOCATIONS
            const locations = event.locations.map((location) => {
                return {
                    lat: location?.location?.lat,
                    lng: location?.location?.lng,
                };
            });
            setCourierLocations(locations);
            setCouriers(event.locations);
        })
    }, [])

    const colorList = ["#584364", "#5a3737", "#42583d", "#DE978F", "#C17F8B", "#9D6C82", "#564779", "#2B2F6C", "#584364", "#5a3737", "#42583d", "#DE978F", "#C17F8B", "#9D6C82", "#564779", "#2B2F6C", "#584364", "#5a3737", "#42583d", "#DE978F", "#C17F8B", "#9D6C82", "#564779", "#2B2F6C", "#584364", "#5a3737", "#42583d", "#DE978F", "#C17F8B", "#9D6C82", "#564779", "#2B2F6C", "#584364", "#5a3737", "#42583d", "#DE978F", "#C17F8B", "#9D6C82", "#564779", "#2B2F6C", "#584364", "#5a3737", "#42583d", "#DE978F", "#C17F8B", "#9D6C82", "#564779", "#2B2F6C"];

    const handleMarkerClick = (marker) => {
        setSelectedMarker(marker);
    };

    const handleMarkerClose = () => {
        setSelectedMarker(null);
    };

    const icon = {
        url: "/box-car.png",
        scaledSize: mapLoaded ? new window.google.maps.Size(50, 50) : null,
    };

    return (
        <>
            {mapLoaded && (
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={zoom}
                    center={mapCenter}
                    ref={mapRef}
                >
                    {courierLocations.map((point, index) => (
                        <Marker
                            key={index}
                            position={courierLocations[index]}
                            onMouseUp={() =>
                                handleMarkerClick({
                                    ...point,
                                })
                            }
                            onMouseDown={handleMarkerClose}
                            icon={icon}
                        >
                            {selectedMarker &&
                                selectedMarker.lat === point.lat &&
                                selectedMarker.lng === point.lng && (
                                    <InfoWindow position={selectedMarker} options={{disableAutoPan: true}}>
                                        <div className="card font-light text-center">
                                            <div className="card-body">
                                                <h5 className="card-title">
                                                    {couriers[index].courierName}
                                                </h5>
                                                <p className="card-text">
                                                    {couriers[index].hasOrder ? "Has Order" : "No Order"}

                                                </p>
                                                <p
                                                    className="card-text">
                                                    {couriers[index].isBusy ? "Not Available" : "Available"}
                                                </p>
                                                <p
                                                    className="card-text">
                                                    {couriers[index].hasFridge ? "Has Fridge" : "No Fridge"}
                                                </p>
                                            </div>
                                        </div>
                                    </InfoWindow>
                                )}
                        </Marker>
                    ))}

                    {areas.map((path, index) => {
                        const color = colorList[index];
                        return (
                            <Polygon
                                key={index}
                                paths={path}
                                options={{
                                    fillColor: color,
                                    strokeColor: color,
                                    strokeOpacity: 0.8,
                                    strokeWeight: 2,
                                    fillOpacity: 0.35,
                                }}
                            />
                        );
                    })}

                    {/* CREATE A FIXED MARKER TO CENTER THE MAP */}
                    <Marker
                        position={mapCenter}
                    />
                </GoogleMap>
            )}
        </>
    );
};

export default MapContainer;
