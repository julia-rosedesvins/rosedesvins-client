"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Supercluster from 'supercluster';
import type { Domain } from '@/services/region.service';

interface RegionMapProps {
  centerLat: number;
  centerLon: number;
  domains: Domain[];
  regionName?: string;
  onMapLoad?: () => void;
  userLocation?: { lat: number; lon: number } | null;
}

export interface RegionMapRef {
  focusOnDomain: (domainId: string) => void;
}

const RegionMap = forwardRef<RegionMapRef, RegionMapProps>(({ centerLat, centerLon, domains, regionName, onMapLoad, userLocation }, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  // Individual domain markers keyed by domainId
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  // All rendered HTML markers (clusters + individuals) so we can clear them on re-render
  const renderedMarkersRef = useRef<maplibregl.Marker[]>([]);
  const currentPopupRef = useRef<maplibregl.Popup | null>(null);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);
  const superclusterRef = useRef<Supercluster | null>(null);

  // ─── Expose focusOnDomain to parent ───────────────────────────────────────
  useImperativeHandle(ref, () => ({
    focusOnDomain: (domainId: string) => {
      const marker = markersRef.current.get(domainId);
      if (marker && map.current) {
        const lngLat = marker.getLngLat();
        map.current.flyTo({ center: [lngLat.lng, lngLat.lat], zoom: 15, duration: 1000 });
        setTimeout(() => { marker.togglePopup(); }, 1000);
      }
    },
  }), []);

  // ─── Build popup HTML for an individual domain ────────────────────────────
  const buildPopupHTML = useCallback((domain: Domain): string => {
    const domainSlugOrId = domain.slug || domain.domainId;
    const experienceHref = domainSlugOrId
      ? (regionName
          ? `/experience/${regionName}/${domainSlugOrId}`
          : `/experience/${domainSlugOrId}`)
      : (domain.siteUrl || '#');
    const buttonLabel = domain.producer === 'client' ? 'Réserver maintenant' : 'Voir le profil';

    return `
      <div class="bg-white" style="width:100%;max-width:100%;box-sizing:border-box;">
        ${domain.domainProfilePictureUrl ? `
          <div style="height:112px;overflow:hidden;">
            <img src="${domain.domainProfilePictureUrl}" alt="${domain.domainName}"
              style="width:100%;height:100%;object-fit:cover;display:block;" />
          </div>` : ''}
        <div style="padding:10px 12px;display:flex;flex-direction:column;gap:8px;box-sizing:border-box;">
          ${domain.category ? `
            <span style="display:inline-block;padding:2px 8px;font-size:10px;font-weight:600;
              color:#3A7E53;background:rgba(58,126,83,0.1);border-radius:6px;
              text-transform:uppercase;letter-spacing:0.05em;width:fit-content;">
              ${domain.category}
            </span>` : ''}
          <h3 style="font-size:14px;font-weight:700;color:#111827;line-height:1.25;margin:0;
            word-wrap:break-word;overflow-wrap:break-word;">
            ${domain.domainName}
          </h3>
          ${domain.domainPrice !== null ? `
            <div><span style="font-size:16px;font-weight:700;color:#111827;">${domain.domainPrice} €</span></div>
          ` : ''}
          <div style="border-top:1px solid #E5E7EB;"></div>
          <a href="${experienceHref}" target="_self"
            style="display:block;width:100%;padding:8px 12px;font-size:12px;font-weight:600;
              color:white;background:#3A7E53;border-radius:8px;
              box-shadow:0 1px 3px rgba(0,0,0,0.1);text-align:center;text-decoration:none;
              transition:background-color 0.2s;box-sizing:border-box;
              white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"
            onmouseover="this.style.background='#2d6340'"
            onmouseout="this.style.background='#3A7E53'">
            ${buttonLabel}
          </a>
        </div>
      </div>`;
  }, [regionName]);

  // ─── Render clusters + individual markers for current viewport ────────────
  const renderClusters = useCallback(() => {
    if (!map.current || !superclusterRef.current) return;

    // Remove all previously rendered markers (except user location)
    renderedMarkersRef.current.forEach(m => m.remove());
    renderedMarkersRef.current = [];
    markersRef.current.clear();

    const mapInst = map.current;
    const zoom = Math.floor(mapInst.getZoom());
    const bounds = mapInst.getBounds();
    const bbox: [number, number, number, number] = [
      bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth(),
    ];

    const clusters = superclusterRef.current.getClusters(bbox, zoom);

    clusters.forEach(feature => {
      const [lng, lat] = feature.geometry.coordinates;
      const props = feature.properties as any;

      if (props.cluster) {
        // ── Cluster marker ───────────────────────────────────────────────
        const count: number = props.point_count;
        const clusterId: number = props.cluster_id;

        const el = document.createElement('div');
        el.style.cssText = `
          width:44px;height:44px;background:#ffffff;border:2.5px solid #3A7E53;
          border-radius:50%;box-shadow:0 4px 12px rgba(0,0,0,0.18);
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;font-size:14px;font-weight:700;color:#3A7E53;
          font-family:sans-serif;user-select:none;`;
        el.textContent = String(count);

        el.addEventListener('click', () => {
          const expansionZoom = Math.min(
            superclusterRef.current!.getClusterExpansionZoom(clusterId),
            20,
          );
          mapInst.flyTo({ center: [lng, lat], zoom: expansionZoom, duration: 600 });
        });

        const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat([lng, lat])
          .addTo(mapInst);

        renderedMarkersRef.current.push(marker);
      } else {
        // ── Individual marker ────────────────────────────────────────────
        const domain: Domain = props.domain;
        if (!domain) return;

        const el = document.createElement('div');
        el.className = 'wine-marker';
        el.style.cssText = `
          width:40px;height:40px;background:#ffffff;border:2px solid #3A7E53;
          border-radius:50%;box-shadow:0 4px 10px rgba(0,0,0,0.15);
          display:flex;align-items:center;justify-content:center;
          overflow:hidden;cursor:pointer;`;

        const img = document.createElement('img');
        img.src = 'https://api.rosedesvins.co/v1/web/image/type-of-experience';
        img.alt = 'wine glass';
        img.style.cssText = 'width:22px;height:22px;object-fit:contain;';
        el.appendChild(img);

        const popup = new maplibregl.Popup({
          maxWidth: '300px',
          className: 'custom-maplibre-popup',
          closeButton: true,
          closeOnClick: false,
          offset: 25,
        }).setHTML(buildPopupHTML(domain));

        el.addEventListener('click', () => {
          if (currentPopupRef.current && currentPopupRef.current !== popup) {
            currentPopupRef.current.remove();
          }
          currentPopupRef.current = popup;
        });

        popup.on('close', () => {
          if (currentPopupRef.current === popup) currentPopupRef.current = null;
        });

        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(mapInst);

        renderedMarkersRef.current.push(marker);

        if (domain.domainId) {
          markersRef.current.set(domain.domainId, marker);
        }
      }
    });
  }, [buildPopupHTML]);

  // ─── Initialise map ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      attributionControl: false,
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png',
              'https://b.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png',
              'https://c.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          },
          'label-tiles': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}.png',
              'https://b.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}.png',
              'https://c.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
          },
        },
        layers: [
          { id: 'simple-tiles', type: 'raster', source: 'raster-tiles', minzoom: 0, maxzoom: 22 },
          { id: 'label-tiles',  type: 'raster', source: 'label-tiles',  minzoom: 0, maxzoom: 22 },
        ],
      },
      center: [centerLon, centerLat],
      zoom: 10,
    });

    map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    return () => {
      if (map.current) { map.current.remove(); map.current = null; }
    };
  }, [centerLon, centerLat]);

  // ─── Re-build supercluster index + markers whenever domains/regionName change
  useEffect(() => {
    if (!map.current) return;

    const validDomains = domains.filter(d => d.latitude && d.longitude);

    // Build supercluster index
    const sc = new Supercluster({ radius: 60, maxZoom: 16 });
    sc.load(
      validDomains.map(domain => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [domain.longitude!, domain.latitude!] },
        properties: { domain },
      })),
    );
    superclusterRef.current = sc;

    // Remove old user location marker
    if (userMarkerRef.current) { userMarkerRef.current.remove(); userMarkerRef.current = null; }

    const setup = () => {
      if (!map.current) return;

      // Fit bounds to all markers
      if (validDomains.length > 0) {
        const bounds = new maplibregl.LngLatBounds();
        validDomains.forEach(d => { if (d.latitude && d.longitude) bounds.extend([d.longitude, d.latitude]); });
        if (userLocation) bounds.extend([userLocation.lon, userLocation.lat]);

        map.current.fitBounds(bounds, { padding: 50, duration: 0 });
      } else {
        map.current.flyTo({ center: [centerLon, centerLat], zoom: 10, duration: 1000 });
      }

      // Initial render of clusters
      renderClusters();

      // Add user location marker
      if (userLocation && map.current) {
        const userEl = document.createElement('div');
        userEl.style.cssText = `
          width:24px;height:24px;background:#3B82F6;border:3px solid #ffffff;
          border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:default;`;
        const um = new maplibregl.Marker({ element: userEl, anchor: 'center' })
          .setLngLat([userLocation.lon, userLocation.lat])
          .addTo(map.current);
        userMarkerRef.current = um;
      }

      if (onMapLoad) onMapLoad();
    };

    if (map.current.loaded()) {
      setup();
    } else {
      map.current.once('load', setup);
    }

    // Re-render clusters whenever the user moves / zooms
    const onMove = () => renderClusters();
    map.current.on('move', onMove);

    return () => {
      map.current?.off('move', onMove);
    };
  }, [domains, centerLat, centerLon, onMapLoad, userLocation, regionName, renderClusters]);

  // ─── JSX ──────────────────────────────────────────────────────────────────
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
          width: 22px; height: 22px; font-size: 16px;
          color: #ffffff; background: #3A7E53;
          border: 1px solid #2d6340; border-radius: 50%;
          box-shadow: 0 3px 10px rgba(0,0,0,0.18);
          padding: 0; display: flex; align-items: center; justify-content: center;
          right: 6px; top: 6px; z-index: 10;
        }
        .custom-maplibre-popup .maplibregl-popup-close-button:hover {
          color: #ffffff; background: #2d6340;
        }
        .custom-maplibre-popup .maplibregl-popup-tip {
          border-top-color: white; border-bottom-color: white;
        }
        @media (max-width: 768px) {
          .custom-maplibre-popup .maplibregl-popup-content {
            width: 240px !important; max-width: 85vw !important;
          }
        }
      `}</style>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </>
  );
});

RegionMap.displayName = 'RegionMap';

export default RegionMap;

