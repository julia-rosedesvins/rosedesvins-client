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

// Custom wine glass icon (white rounded background)
const wineGlassIcon = L.divIcon({
  className: 'wine-glass-marker',
  html: `
    <div class="wine-marker">
      <img src="https://api.rosedesvins.co/v1/web/image/type-of-experience" alt="wine glass" />
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -34],
});

// Add custom styles for the marker and popup
const mapStyles = `
  .wine-marker {
    width: 40px;
    height: 40px;
    background: #ffffff;
    border: 2px solid #3A7E53;
    border-radius: 9999px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .wine-marker img {
    width: 22px;
    height: 22px;
    object-fit: contain;
    display: block;
  }
  .leaflet-popup-content-wrapper {
    border-radius: 12px;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
    padding: 0;
    overflow: hidden;
    width: 350px;
    max-width: 350px;
  }
  .leaflet-popup-content {
    margin: 0;
    width: 100% !important;
  }
  .leaflet-popup-tip {
    background: white;
  }
  .custom-popup .leaflet-popup-close-button {
    top: 10px;
    right: 10px;
    width: 28px;
    height: 28px;
    font-size: 20px;
    color: #ffffff !important;
    background: #3A7E53 !important;
    border: 1px solid #2d6340 !important;
    border-radius: 50%;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
  }
  .custom-popup .leaflet-popup-close-button:hover {
    color: #ffffff !important;
    background: #3A7E53 !important;
    border-color: #2d6340 !important;
    opacity: 1;
  }
  .custom-popup .leaflet-popup-close-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(58, 126, 83, 0.35);
  }
  .custom-popup a,
  .custom-popup a:visited {
    color: #ffffff !important;
    text-decoration: none;
  }
`;

interface DomainMapProps {
  latitude: number;
  longitude: number;
  domainName: string;
  address?: string;
  city?: string;
  codePostal?: string;
  domainImage?: string;
}

export default function DomainMap({ latitude, longitude, domainName, address, city, codePostal, domainImage }: DomainMapProps) {
  return (
    <>
      <style>{mapStyles}</style>
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
        <Marker position={[latitude, longitude]} icon={wineGlassIcon}>
          <Popup maxWidth={350} minWidth={350} className="custom-popup">
            <div className="bg-white">
              {/* Hero Image */}
              {domainImage && (
                <div className="relative w-full h-40 overflow-hidden">
                  <img
                    src={domainImage}
                    alt={domainName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Content */}
              <div className="px-5 py-4 space-y-3">
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                  {domainName}
                </h3>
                
                {/* Address */}
                {/* {address && (
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {address}
                  </p>
                )} */}
                {/* {codePostal && city && (
                  <p className="text-sm text-gray-700">
                    {codePostal} {city}
                  </p>
                )} */}
                
                {/* Divider */}
                <div className="border-t border-gray-200"></div>
                
                {/* Action Button */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-5 py-3 text-sm font-semibold text-white bg-[#3A7E53] rounded-lg shadow-md hover:bg-[#2d6340] transition-colors text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  Voir sur Google Maps
                </a>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </>
  );
}
