import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import LocationDialog from './LocationDialog';
import TripList from './TripList';

const pickupIcon = L.icon({
    iconUrl: 'images/pickup-icon.png',
    shadowUrl: 'images/marker-shadow.png',
    iconSize: [41, 41],
    iconAnchor: [12, 41],
});

const dropoffIcon = L.icon({
    iconUrl: 'images/dropoff-icon.png',
    shadowUrl: 'images/marker-shadow.png',
    iconSize: [41, 41],
    iconAnchor: [12, 41],
});

const BASE_FARE = 3; // Base fare in dollars
const PER_KM_FARE = 1; // Fare per kilometer
const AVERAGE_SPEED = 40; // Average speed in km/h

const TripMap = () => {
    const [isOpen, setIsOpen] = useState(false)
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [trips, setTrips] = useState([]);
    const [nextTripId, setNextTripId] = useState(1);
    const [openDialog, setOpenDialog] = useState(false);
    const [tempCoordinate, setTempCoordinate] = useState(null);
    const [routeControl, setRouteControl] = useState(null);
    const [sortCriteria, setSortCriteria] = useState('fare');
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
            const initialMap = L.map(mapRef.current).setView([-6.2729, 106.7893], 14);
            L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                attribution: '&copy; Google Maps',
            }).addTo(initialMap);
            setMap(initialMap);
            return () => {
                initialMap.remove();
            };
    }, []);

    const handleMapClick = (event) => {
        const { lat, lng } = event.latlng;
        setTempCoordinate({ lat, lng });
        setOpenDialog(true);
    };

    const addMarkerToMap = (type) => {
        if (map) {
            const icon = type === 'pickup' ? pickupIcon : dropoffIcon;
            L.marker([tempCoordinate.lat, tempCoordinate.lng], { icon }).addTo(map);
        }
    };

    const handleDialogClose = (type) => {
        if (type && tempCoordinate) {
            const newCoordinate = { ...tempCoordinate, type };
            if (type === 'dropoff') handleDropoff(newCoordinate);
            if (type === 'pickup') handlePickup(newCoordinate);
            addMarkerToMap(type);
        }
        setOpenDialog(false);
    };

    const handleDropoff = (coordinate) => {
        const lastTrip = trips[trips.length - 1];
        if (lastTrip?.pickup && !lastTrip.dropoff) {
            const distance = L.latLng(lastTrip.pickup.lat, lastTrip.pickup.lng)
                .distanceTo(L.latLng(coordinate.lat, coordinate.lng)) / 1000; // km
            const fare = BASE_FARE + (distance * PER_KM_FARE);
            const estimatedTime = Math.round((distance / AVERAGE_SPEED) * 60); // in minutes
            const updatedTrip = {
                ...lastTrip,
                dropoff: coordinate,
                distance: distance.toFixed(2),
                fare: fare.toFixed(2),
                estimatedTime,
            };
            setTrips((prev) => {
                const newTrips = [...prev];
                newTrips[newTrips.length - 1] = updatedTrip;
                return newTrips;
            });
            updateRoute(lastTrip.pickup, coordinate);
        } else {
            alert("Please select a pickup before adding a dropoff.");
        }
    };

    const handlePickup = (coordinate) => {
        if (!trips.length || (trips.length && trips[trips.length - 1].dropoff)) {
            const newTrip = {
                id: nextTripId,
                pickup: coordinate,
                dropoff: null,
            };
            setTrips((prev) => [...prev, newTrip]);
            setNextTripId((prev) => prev + 1);
        } else {
            alert("This trip already has a pickup and cannot add another.");
        }
    };

    const updateRoute = (pickup, dropoff) => {
        if (routeControl) routeControl.remove();
        const newRouteControl = L.Routing.control({
            waypoints: [
                L.latLng(pickup.lat, pickup.lng),
                L.latLng(dropoff.lat, dropoff.lng),
            ],
            addWaypoints: true,
            routeWhileDragging: true,
            draggableWaypoints: true,
            createMarker: () => null,
        }).addTo(map);
        setRouteControl(newRouteControl);
    };

    const showRouteForTrip = (trip) => {
        if (routeControl) routeControl.remove();
        const newRouteControl = L.Routing.control({
            waypoints: [
                L.latLng(trip.pickup.lat, trip.pickup.lng),
                L.latLng(trip.dropoff.lat, trip.dropoff.lng),
            ],
            addWaypoints: true,
            routeWhileDragging: true,
            draggableWaypoints: true,
            createMarker: () => null,
        }).addTo(map);
        setRouteControl(newRouteControl);
    };

    useEffect(() => {
        if (map) map.on('click', handleMapClick);
        return () => {
            if (routeControl) routeControl.remove();
        };
    }, [map, routeControl]);

    return (

        <div className="flex h-screen">
            <div className="relative w-screen" ref={mapRef}></div>
            <button className={`p-2 mix-blend-screen bg-indigo-500 text-white border-r shadow-xl shadow-white/50 border-white font-bold`} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? '>>' : '<<'}
            </button>
            {isOpen && (
                <TripList
                    trips={trips}
                    onTripClick={showRouteForTrip}
                    sortCriteria={sortCriteria}
                    setSortCriteria={setSortCriteria}
                    sortDirection={sortDirection}
                    setSortDirection={setSortDirection}
                />
            )}
            <LocationDialog open={openDialog} onClose={handleDialogClose} />
        </div>
    );
};

export default TripMap;


