import React from 'react';
import { Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapView = ({ markers = [], hotspots = [] }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>Current Activities Map</Typography>
      <MapContainer 
        center={[40.7831, -73.9712]} 
        zoom={13} 
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Render hotspots first so they appear under markers */}
        {hotspots.map((hotspot, index) => (
          <Circle
            key={`hotspot-${index}`}
            center={hotspot.center}
            radius={hotspot.radius}
            pathOptions={{
              color: hotspot.color,
              fillColor: hotspot.color,
              fillOpacity: 0.2,
            }}
          >
            <Popup>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                AI Predicted Hotspot
              </Typography>
              <Typography variant="body2">
                Risk Level: {hotspot.riskLevel}<br />
                Predicted Incidents: {hotspot.predictedIncidents}<br />
                Category: {hotspot.category}
              </Typography>
            </Popup>
          </Circle>
        ))}

        {/* Render markers on top of hotspots */}
        {markers.map((marker, index) => (
          <Marker key={`marker-${index}`} position={marker.position}>
            <Popup>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {marker.name}
              </Typography>
              <Typography variant="body2">
                {marker.details}
              </Typography>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
};

export default MapView; 