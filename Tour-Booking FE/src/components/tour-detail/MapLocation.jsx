import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Create custom green icon for start location
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapLocation = ({ locations, startLocation, selectedLocation }) => {
  const locationToFocus = selectedLocation || startLocation || (locations && locations[0]);

  const center = locationToFocus
    ? [locationToFocus.coordinates[1], locationToFocus.coordinates[0]]
    : [21.0285, 105.8542]; // Default Hanoi

  return (
    <section id="tour-map" className="mt-10 container max-w-5xl p-6 mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-cyan-700">
        Bản đồ vị trí
      </h1>
      <div className="h-96 rounded-lg overflow-hidden shadow-md">
        <MapContainer
          center={center}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
          key={center.toString()} // Đảm bảo reset map khi center thay đổi
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Start Location Marker (Green) */}
          {startLocation && startLocation.coordinates && (
            <Marker
              position={[
                startLocation.coordinates[1],
                startLocation.coordinates[0],
              ]}
              icon={greenIcon}
            >
              <Popup>
                <strong>🚩 Điểm xuất phát</strong>
                <br />
                <strong>{startLocation.address}</strong>
                <br />
                {startLocation.description}
              </Popup>
            </Marker>
          )}

          {/* Selected/Focused Location Marker (Red - Default) */}
          {locationToFocus && (
            <Marker
              position={[
                locationToFocus.coordinates[1],
                locationToFocus.coordinates[0],
              ]}
            >
              <Popup>
                <strong>{locationToFocus.address}</strong>
                <br />
                {locationToFocus.description}
              </Popup>
            </Marker>
          )}

          {/* Tự động focus vào location */}
          {locationToFocus && <MapFocus location={locationToFocus} />}
        </MapContainer>
      </div>
    </section>
  );
};

const MapFocus = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    const { coordinates } = location;
    map.setView([coordinates[1], coordinates[0]], 13, {
      animate: true,
    });
  }, [location, map]);

  return null;
};

export default MapLocation;
