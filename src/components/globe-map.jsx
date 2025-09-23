"use client";

import { useCallback, useMemo, useState } from "react";
import Map, { GeolocateControl, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

const GlobeMap = () => {
  const [viewState, setViewState] = useState({
    longitude: -74.5,
    latitude: 40,
    zoom: 2,
    pitch: 0,
    bearing: 0,
  });

  // Memoizar el estilo del mapa para evitar re-renderizados innecesarios
  const mapStyle = useMemo(
    () => ({
      version: 8,
      sources: {
        "osm-tiles": {
          type: "raster",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution: "© OpenStreetMap contributors",
        },
      },
      layers: [
        {
          id: "osm-tiles-layer",
          type: "raster",
          source: "osm-tiles",
        },
      ],
    }),
    [],
  );

  // Usar useCallback para optimizar la función de movimiento
  const handleMove = useCallback((evt) => {
    setViewState(evt.viewState);
  }, []);

  return (
    <div className="w-full h-screen">
      <Map
        {...viewState}
        onMove={handleMove}
        mapStyle={mapStyle}
        projection="globe"
        style={{ width: "100%", height: "100%" }}
        maxZoom={18}
        minZoom={1}
        // Configuraciones para mejorar el rendimiento y reducir parpadeos
        antialias={true}
        preserveDrawingBuffer={false}
        failIfMajorPerformanceCaveat={false}
        // Configuración de transiciones más suaves
        transitionDuration={200}
        transitionInterpolator={null}
        // Configuración para el globo
        renderWorldCopies={false}
        dragRotate={true}
        doubleClickZoom={true}
        keyboard={true}
        scrollZoom={true}
        touchZoom={true}
        touchRotate={true}
      >
        {/* Controles de navegación */}
        <NavigationControl position="top-right" visualizePitch={true} />

        {/* Control de geolocalización */}
        <GeolocateControl position="top-left" trackUserLocation showUserHeading />
      </Map>
    </div>
  );
};

export default GlobeMap;
