import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapDisplay.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/**
 * MapDisplay Component
 * 
 * A React component that displays a Leaflet map with a marker showing the 
 * coordinates entered by the user in the coordinate search box.
 */
const MapDisplay = ({ coordinateResult, className = "" }) => {
  // Return null if no valid coordinate data
  if (!coordinateResult || !coordinateResult.latitude || !coordinateResult.longitude || !coordinateResult.valid) {
    return null;
  }

  const { latitude, longitude } = coordinateResult;
  const position = [latitude, longitude];

  // Format coordinates for display
  const formatCoordinate = (value, precision = 6) => {
    return parseFloat(value).toFixed(precision);
  };

  return (
    <div className={`map-display ${className}`}>
      <div className="map-header">
        <h3>Kartposition</h3>
        <p className="coordinates-display">
          Lat: {formatCoordinate(latitude)}, Lng: {formatCoordinate(longitude)}
        </p>
      </div>
      
      <div className="map-container">
        <MapContainer 
          center={position} 
          zoom={10} 
          style={{ height: '300px', width: '100%' }}
          key={`${latitude}-${longitude}`} // Force re-render when coordinates change
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <div className="popup-content">
                <strong>Angiven position</strong><br />
                Latitud: {formatCoordinate(latitude)}<br />
                Longitud: {formatCoordinate(longitude)}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default MapDisplay;