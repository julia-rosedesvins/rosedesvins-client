"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface DomainMapProps {
  latitude: number;
  longitude: number;
  domainName: string;
  address?: string;
  city?: string;
  codePostal?: string;
}

export default function DomainMap({ latitude, longitude, domainName, address, city, codePostal }: DomainMapProps) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      style={{ height: '400px', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]}>
        <Popup>
          <div className="p-2">
            <h3 className="font-bold text-primary">{domainName}</h3>
            {address && <p className="text-sm text-gray-600">{address}</p>}
            {codePostal && city && (
              <p className="text-sm text-gray-600">{codePostal} {city}</p>
            )}
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
