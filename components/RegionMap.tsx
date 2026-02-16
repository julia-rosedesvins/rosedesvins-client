"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
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

// Custom wine glass icon (white rounded background)
const wineGlassIcon = L.divIcon({
  className: 'wine-glass-marker',
  html: `
    <div class="wine-marker">
      <img src="https://api.rosedesvins.co/v1/web/image/wine-glass" alt="wine glass" />
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -34],
});

// Add custom styles for the popup
const popupStyles = `
  .leaflet-popup-content-wrapper {
    border-radius: 12px;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
    padding: 0;
    overflow: hidden;
    width: 300px;
    max-width: 300px;
  }
  .leaflet-popup-content {
    margin: 0;
    width: 100% !important;
  }
  .leaflet-popup-tip {
    background: white;
  }
  .custom-popup .leaflet-popup-close-button {
    top: 6px;
    right: 6px;
    width: 22px;
    height: 22px;
    font-size: 16px;
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

  /* Mobile responsive popup */
  @media (max-width: 768px) {
    .leaflet-popup-content-wrapper {
      width: 225px !important;
      max-width: 85vw !important;
    }
  }

  /* Custom marker */
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
`;

interface RegionMapProps {
  centerLat: number;
  centerLon: number;
  domains: Domain[];
  onMapLoad?: () => void;
}

export interface RegionMapRef {
  focusOnDomain: (domainId: string) => void;
}

function MapUpdater({ 
  centerLat, 
  centerLon, 
  domains, 
  onMapLoad, 
  markersRef 
}: RegionMapProps & { 
  markersRef: React.MutableRefObject<Map<string, L.Marker>> 
}) {
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
    
    // Notify parent when map is ready
    const timeoutId = setTimeout(() => {
      onMapLoad?.();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [centerLat, centerLon, domains, map, onMapLoad]);

  // Store map instance for parent access
  useEffect(() => {
    (window as any).__regionMap = map;
    return () => {
      delete (window as any).__regionMap;
    };
  }, [map]);
  
  return null;
}

const RegionMap = forwardRef<RegionMapRef, RegionMapProps>(({ centerLat, centerLon, domains, onMapLoad }, ref) => {
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    focusOnDomain: (domainId: string) => {
      const marker = markersRef.current.get(domainId);
      const map = (window as any).__regionMap;
      
      if (marker && map) {
        const latLng = marker.getLatLng();
        map.setView(latLng, 15, { animate: true });
        setTimeout(() => {
          marker.openPopup();
        }, 300);
      }
    }
  }), []);

  return (
    <>
      <style>{popupStyles}</style>
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
      <MapUpdater 
        centerLat={centerLat} 
        centerLon={centerLon} 
        domains={domains} 
        onMapLoad={onMapLoad} 
        markersRef={markersRef}
      />
      {domains
        .filter(d => d.latitude && d.longitude)
        .map((domain, index) => (
          <Marker 
            key={index} 
            position={[domain.latitude!, domain.longitude!]} 
            icon={wineGlassIcon}
            ref={(marker) => {
              if (marker && domain.domainId) {
                markersRef.current.set(domain.domainId, marker as unknown as L.Marker);
              }
            }}
          > 
            <Popup maxWidth={300} className="custom-popup">
              <div className="bg-white">
                {/* Hero Image */}
                {domain.domainProfilePictureUrl && (
                  <div className="relative w-full h-28 overflow-hidden">
                    <img
                      src={domain.domainProfilePictureUrl}
                      alt={domain.domainName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Content */}
                <div className="px-3 pt-2.5 pb-3 space-y-2">
                  {/* Category Badge */}
                  {domain.category && (
                    <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-[#3A7E53] bg-[#3A7E53]/10 rounded-md uppercase tracking-wide">
                      {domain.category}
                    </span>
                  )}
                  
                  {/* Title */}
                  <h3 className="text-sm font-bold text-gray-900 leading-tight">
                    {domain.domainName}
                  </h3>
                  
                  {/* Description */}
                  {domain.domainDescription && (
                    <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed">
                      {domain.domainDescription}
                    </p>
                  )}
                  
                  {/* Price */}
                  {domain.domainPrice !== null && (
                    <div>
                      <span className="text-base font-bold text-gray-900">{domain.domainPrice} €</span>
                    </div>
                  )}
                  
                  {/* Divider */}
                  <div className="border-t border-gray-200"></div>
                  
                  {/* Action Button */}
                  <a
                    href={domain.producer === 'client' 
                      ? `/experience/${domain.domainId}` 
                      : domain.siteUrl || '#'}
                    target={domain.producer === 'non-client' ? "_blank" : "_self"}
                    rel={domain.producer === 'non-client' ? "noopener noreferrer" : undefined}
                    className="block w-full px-3 py-2 text-xs font-semibold text-white bg-[#3A7E53] rounded-lg shadow-md hover:bg-[#2d6340] transition-colors text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {domain.producer === 'client' ? 'Réserver maintenant' : 'En savoir plus'}
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
});

RegionMap.displayName = 'RegionMap';

export default RegionMap;
