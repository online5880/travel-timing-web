/* Data-Driven Expedition Interface Design
 * - Leaflet.js interactive world map
 * - Click to select destination
 * - Minimal styling with 1px borders
 */

import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapViewProps {
  onLocationSelect: (lat: number, lng: number, locationName: string) => void;
  selectedLocation: { lat: number; lng: number; name: string } | null;
}

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
}

export default function MapView({ onLocationSelect, selectedLocation }: MapViewProps) {
  const center: LatLngExpression = [20, 0];

  const handleLocationSelect = async (lat: number, lng: number) => {
    // Reverse geocoding to get location name
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`
      );
      const data = await response.json();
      const locationName = data.address?.city || data.address?.country || data.display_name || 'Unknown Location';
      onLocationSelect(lat, lng, locationName);
    } catch (error) {
      console.error('Geocoding error:', error);
      onLocationSelect(lat, lng, 'Unknown Location');
    }
  };

  return (
    <div className="w-full h-full border border-border">
      <MapContainer
        center={center}
        zoom={2}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onLocationSelect={handleLocationSelect} />
        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
            <Popup>
              <div className="font-medium">{selectedLocation.name}</div>
              <div className="text-xs font-mono text-muted-foreground">
                {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
