
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { UserLocation } from '../types';
import L from 'leaflet';

const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MapUpdaterProps {
  location: UserLocation | null;
}

const MapUpdater: React.FC<MapUpdaterProps> = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location) {
      // 1. Fly to the new location and zoom in.
      map.flyTo([location.lat, location.lng], 16, {
        animate: true,
        duration: 1.5, // Animation duration of 1.5 seconds.
      });

      // 2. After a pause, zoom out slightly to give context.
      const zoomOutTimer = setTimeout(() => {
        map.flyTo([location.lat, location.lng], 14, {
          animate: true,
          duration: 1.5, // Animation duration of 1.5 seconds.
        });
      }, 1500 + 3000); // 1.5s for fly-in + 3s pause.

      // Cleanup timer on component unmount or if location changes.
      return () => {
        clearTimeout(zoomOutTimer);
      };
    }
  }, [location, map]);

  return null;
};


interface MapDisplayProps {
  location: UserLocation | null;
  isEmergency: boolean;
  message: string;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ location, isEmergency, message }) => {
  const defaultPosition: [number, number] = [34.0522, -118.2437]; // Default to Los Angeles
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
      if (location && markerRef.current) {
          // Open the popup once the location is available.
          // The flyTo animation will handle bringing it into view.
          markerRef.current.openPopup();
      }
  }, [location]);

  return (
    <MapContainer center={defaultPosition} zoom={8} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {location && (
        <Marker ref={markerRef} position={[location.lat, location.lng]} icon={isEmergency ? redIcon : greenIcon}>
          <Popup>
            <div className="text-center font-sans">
                <p className="font-bold text-base mb-1">{isEmergency ? "Emergency Report:" : "User Message:"}</p>
                <p className="text-sm">{message}</p>
            </div>
          </Popup>
        </Marker>
      )}
      <MapUpdater location={location} />
    </MapContainer>
  );
};

export default MapDisplay;