"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Domain } from '@/services/region.service';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface RegionMapProps {
  centerLat: number;
  centerLon: number;
  domains: Domain[];
}

function MapUpdater({ centerLat, centerLon, domains }: RegionMapProps) {
  const map = useMap();
  
  useEffect(() => {
    if (domains.length > 0) {
      const validCoords = domains
        .filter(d => d.latitude && d.longitude)
        .map(d => [d.latitude!, d.longitude!] as [number, number]);
      
      if (validCoords.length > 0) {
        const bounds = L.latLngBounds(validCoords);
        map.fitBounds(bounds, { padding: [50, 50] });
      } else {
        map.setView([centerLat, centerLon], 10);
      }
    } else {
      map.setView([centerLat, centerLon], 10);
    }
  }, [centerLat, centerLon, domains, map]);
  
  return null;
}

export default function RegionMap({ centerLat, centerLon, domains }: RegionMapProps) {
  return (
    <MapContainer
      center={[centerLat, centerLon]}
      zoom={10}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater centerLat={centerLat} centerLon={centerLon} domains={domains} />
      {domains
        .filter(d => d.latitude && d.longitude)
        .map((domain, index) => (
          <Marker key={index} position={[domain.latitude!, domain.longitude!]}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-primary">{domain.domainName}</h3>
                {domain.location && <p className="text-sm text-gray-600">{domain.location}</p>}
                {domain.domainPrice && (
                  <p className="text-sm font-semibold mt-1">{domain.domainPrice}€</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
