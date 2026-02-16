"use client";

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
              'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
              'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
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
      center: [longitude, latitude],
      zoom: 13,
      scrollZoom: false
    });

    // Add zoom controls (without compass)
    map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

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
      <div class="bg-white" style="width: 350px; max-width: 85vw;">
        ${domainImage ? `
          <div class="relative w-full" style="height: 160px; overflow: hidden;">
            <img
              src="${domainImage}"
              alt="${domainName}"
              style="width: 100%; height: 100%; object-fit: cover;"
            />
          </div>
        ` : ''}
        
        <div style="padding: 16px 20px; display: flex; flex-direction: column; gap: 12px;">
          <h3 style="font-size: 18px; font-weight: 700; color: #111827; line-height: 1.25; margin: 0;">
            ${domainName}
          </h3>
          
          <div style="border-top: 1px solid #E5E7EB;"></div>
          
          <a
            href="https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}"
            target="_blank"
            rel="noopener noreferrer"
            style="display: block; width: 100%; padding: 12px 20px; font-size: 14px; font-weight: 600; color: white; background: #3A7E53; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); text-align: center; text-decoration: none; transition: background-color 0.2s;"
            onmouseover="this.style.background='#2d6340'"
            onmouseout="this.style.background='#3A7E53'"
          >
            Voir sur Google Maps
          </a>
        </div>
      </div>
    `;

    // Create popup with custom styling
    const popup = new maplibregl.Popup({
      maxWidth: '350px',
      className: 'custom-maplibre-popup',
      closeButton: true,
      closeOnClick: false,
      offset: 25
    }).setHTML(popupHTML);

    // Create and add marker
    new maplibregl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([longitude, latitude])
      .setPopup(popup)
      .addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [latitude, longitude, domainName, domainImage]);

  return (
    <>
      <style>{`
        .custom-maplibre-popup .maplibregl-popup-content {
          padding: 0;
          border-radius: 12px;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
          overflow: hidden;
        }
        
        .custom-maplibre-popup .maplibregl-popup-close-button {
          width: 28px;
          height: 28px;
          font-size: 20px;
          color: #ffffff;
          background: #3A7E53;
          border: 1px solid #2d6340;
          border-radius: 50%;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          right: 10px;
          top: 10px;
        }
        
        .custom-maplibre-popup .maplibregl-popup-close-button:hover {
          color: #ffffff;
          background: #2d6340;
        }
        
        .custom-maplibre-popup .maplibregl-popup-tip {
          border-top-color: white;
          border-bottom-color: white;
        }
      `}</style>
      <div ref={mapContainer} style={{ height: '400px', width: '100%' }} />
    </>
  );
}
