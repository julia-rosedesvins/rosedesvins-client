"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Domain } from '@/services/region.service';

interface RegionMapProps {
  centerLat: number;
  centerLon: number;
  domains: Domain[];
  onMapLoad?: () => void;
  userLocation?: { lat: number; lon: number } | null;
}

export interface RegionMapRef {
  focusOnDomain: (domainId: string) => void;
}

const RegionMap = forwardRef<RegionMapRef, RegionMapProps>(({ centerLat, centerLon, domains, onMapLoad, userLocation }, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const currentPopupRef = useRef<maplibregl.Popup | null>(null);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    focusOnDomain: (domainId: string) => {
      const marker = markersRef.current.get(domainId);
      
      if (marker && map.current) {
        const lngLat = marker.getLngLat();
        map.current.flyTo({
          center: [lngLat.lng, lngLat.lat],
          zoom: 15,
          duration: 1000
        });
        
        setTimeout(() => {
          marker.togglePopup();
        }, 1000);
      }
    }
  }), []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png',
              'https://b.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png',
              'https://c.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          }
        },
        layers: [
          {
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      },
      center: [centerLon, centerLat],
      zoom: 10
    });

    // Add zoom controls (without compass)
    map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [centerLon, centerLat]);

  // Update map bounds and markers when domains change
  useEffect(() => {
    if (!map.current) return;

    const addMarkers = () => {
      if (!map.current) return;
      
      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current.clear();

      // Clear user marker if it exists
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }

      const validDomains = domains.filter(d => d.latitude && d.longitude);

      if (validDomains.length > 0) {
        // Add markers
        validDomains.forEach((domain) => {
          if (!domain.latitude || !domain.longitude || !map.current) return;

          // Create custom marker element
          const el = document.createElement('div');
          el.className = 'wine-marker';
          el.style.width = '40px';
          el.style.height = '40px';
          el.style.background = '#ffffff';
          el.style.border = '2px solid #3A7E53';
          el.style.borderRadius = '50%';
          el.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.15)';
          el.style.display = 'flex';
          el.style.alignItems = 'center';
          el.style.justifyContent = 'center';
          el.style.overflow = 'hidden';
          el.style.cursor = 'pointer';
          
          const img = document.createElement('img');
          img.src = 'https://api.rosedesvins.co/v1/web/image/type-of-experience';
          img.alt = 'wine glass';
          img.style.width = '22px';
          img.style.height = '22px';
          img.style.objectFit = 'contain';
          el.appendChild(img);

        // Create popup HTML
        const popupHTML = `
          <div class="bg-white" style="width: 100%; max-width: 100%; box-sizing: border-box;">
            ${domain.domainProfilePictureUrl ? `
              <div class="relative w-full" style="height: 112px; overflow: hidden;">
                <img
                  src="${domain.domainProfilePictureUrl}"
                  alt="${domain.domainName}"
                  style="width: 100%; height: 100%; object-fit: cover; display: block;"
                />
              </div>
            ` : ''}
            
            <div style="padding: 10px 12px; display: flex; flex-direction: column; gap: 8px; box-sizing: border-box;">
              ${domain.category ? `
                <span style="display: inline-block; padding: 2px 8px; font-size: 10px; font-weight: 600; color: #3A7E53; background: rgba(58, 126, 83, 0.1); border-radius: 6px; text-transform: uppercase; letter-spacing: 0.05em; width: fit-content; box-sizing: border-box;">
                  ${domain.category}
                </span>
              ` : ''}
              
              <h3 style="font-size: 14px; font-weight: 700; color: #111827; line-height: 1.25; margin: 0; word-wrap: break-word; overflow-wrap: break-word;">
                ${domain.domainName}
              </h3>
              
              ${domain.domainPrice !== null ? `
                <div>
                  <span style="font-size: 16px; font-weight: 700; color: #111827;">${domain.domainPrice} €</span>
                </div>
              ` : ''}
              
              <div style="border-top: 1px solid #E5E7EB;"></div>
              
              <a
                href="${domain.producer === 'client' ? `/experience/${domain.domainId}` : domain.siteUrl || '#'}"
                target="${domain.producer === 'non-client' ? '_blank' : '_self'}"
                ${domain.producer === 'non-client' ? 'rel="noopener noreferrer"' : ''}
                style="display: block; width: 100%; padding: 8px 12px; font-size: 12px; font-weight: 600; color: white; background: #3A7E53; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); text-align: center; text-decoration: none; transition: background-color 0.2s; box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                onmouseover="this.style.background='#2d6340'"
                onmouseout="this.style.background='#3A7E53'"
              >
                ${domain.producer === 'client' ? 'Réserver maintenant' : 'En savoir plus'}
              </a>
            </div>
          </div>
        `;

          // Create popup with custom styling
          const popup = new maplibregl.Popup({
            maxWidth: '300px',
            className: 'custom-maplibre-popup',
            closeButton: true,
            closeOnClick: false,
            offset: 25
          }).setHTML(popupHTML);

          // Create marker
          const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat([domain.longitude, domain.latitude])
            .setPopup(popup)
            .addTo(map.current);

          // Add click event to close other popups when this one opens
          el.addEventListener('click', () => {
            // Close current popup if it exists and is different from this one
            if (currentPopupRef.current && currentPopupRef.current !== popup) {
              currentPopupRef.current.remove();
            }
            // Set this popup as the current one
            currentPopupRef.current = popup;
          });

          // Clean up reference when popup is closed
          popup.on('close', () => {
            if (currentPopupRef.current === popup) {
              currentPopupRef.current = null;
            }
          });

          if (domain.domainId) {
            markersRef.current.set(domain.domainId, marker);
          }
        });

        // Add user location marker if available
        if (userLocation && map.current) {
          const userEl = document.createElement('div');
          userEl.className = 'user-marker';
          userEl.style.width = '24px';
          userEl.style.height = '24px';
          userEl.style.background = '#3B82F6';
          userEl.style.border = '3px solid #ffffff';
          userEl.style.borderRadius = '50%';
          userEl.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
          userEl.style.cursor = 'default';

          const userMarker = new maplibregl.Marker({ element: userEl, anchor: 'center' })
            .setLngLat([userLocation.lon, userLocation.lat])
            .addTo(map.current);

          userMarkerRef.current = userMarker;
        }

        // Fit bounds to show all markers
        if (!map.current) return;
        const bounds = new maplibregl.LngLatBounds();
        validDomains.forEach(domain => {
          if (domain.latitude && domain.longitude) {
            bounds.extend([domain.longitude, domain.latitude]);
          }
        });

        // Include user location in bounds if available
        if (userLocation) {
          bounds.extend([userLocation.lon, userLocation.lat]);
        }

        map.current.fitBounds(bounds, {
          padding: 50,
          duration: 1000
        });
      } else {
        if (!map.current) return;
        map.current.flyTo({
          center: [centerLon, centerLat],
          zoom: 10,
          duration: 1000
        });
      }

      // Notify parent when map is ready
      if (onMapLoad) {
        onMapLoad();
      }
    };

    // Wait for map to load before adding markers
    if (map.current.loaded()) {
      addMarkers();
    } else {
      map.current.once('load', addMarkers);
    }
  }, [domains, centerLat, centerLon, onMapLoad, userLocation]);

  return (
    <>
      <style>{`
        .custom-maplibre-popup .maplibregl-popup-content {
          padding: 0;
          border-radius: 12px;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
          overflow: hidden;
          width: 300px;
          max-width: 85vw;
          box-sizing: border-box;
        }
        
        .custom-maplibre-popup .maplibregl-popup-close-button {
          width: 22px;
          height: 22px;
          font-size: 16px;
          color: #ffffff;
          background: #3A7E53;
          border: 1px solid #2d6340;
          border-radius: 50%;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          right: 6px;
          top: 6px;
          z-index: 10;
        }
        
        .custom-maplibre-popup .maplibregl-popup-close-button:hover {
          color: #ffffff;
          background: #2d6340;
        }
        
        .custom-maplibre-popup .maplibregl-popup-tip {
          border-top-color: white;
          border-bottom-color: white;
        }
        
        @media (max-width: 768px) {
          .custom-maplibre-popup .maplibregl-popup-content {
            width: 240px !important;
            max-width: 85vw !important;
          }
        }
      `}</style>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </>
  );
});

RegionMap.displayName = 'RegionMap';

export default RegionMap;
