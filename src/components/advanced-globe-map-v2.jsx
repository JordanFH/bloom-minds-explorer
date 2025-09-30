"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Map, { GeolocateControl, Layer, NavigationControl, Source } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

const AdvancedGlobeMapV2 = () => {
  const mapRef = useRef();
  const rotationRef = useRef();
  const [viewState, setViewState] = useState({
    longitude: -74.5,
    latitude: 40,
    zoom: 2,
    pitch: 0,
    bearing: 0,
  });
  const [projection, setProjection] = useState("globe");
  const [currentMapStyle, setCurrentMapStyle] = useState("satellite");

  // Memoizar datos de ciudades para evitar re-creaciones
  const citiesData = useMemo(
    () => ({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [-74.006, 40.7128] },
          properties: { name: "Nueva York", population: 8000000 },
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [2.3522, 48.8566] },
          properties: { name: "París", population: 2150000 },
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [139.6503, 35.6762] },
          properties: { name: "Tokio", population: 13500000 },
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [-77.0428, -12.0464] },
          properties: { name: "Lima", population: 10000000 },
        },
      ],
    }),
    [],
  );

  // Estilo híbrido original: Satélite + Límites + Nombres de países
  const satelliteStyle = useMemo(
    () => ({
      version: 8,
      glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
      sources: {
        // Fuente de imágenes satelitales
        satellite: {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution: "© Esri, DigitalGlobe, GeoEye, Earthstar Geographics",
        },
        // Fuente para límites y etiquetas (transparente)
        boundaries: {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution: "© Esri",
        },
        // Fuente vectorial para países (mejor control)
        countries: {
          type: "vector",
          tiles: ["https://demotiles.maplibre.org/tiles/{z}/{x}/{y}.pbf"],
          attribution: "© MapLibre",
        },
      },
      layers: [
        {
          id: "background",
          type: "background",
          paint: {
            "background-color": "#000000", // Negro para mejor contraste con satélite
          },
        },
        // Capa base: Imágenes satelitales
        {
          id: "satellite-layer",
          type: "raster",
          source: "satellite",
          paint: {
            "raster-opacity": 1.0,
            "raster-brightness-max": 1.0,
            "raster-contrast": 0.1, // Ligero aumento de contraste
          },
        },
        // Capa de límites y nombres (superpuesta)
        {
          id: "boundaries-layer",
          type: "raster",
          source: "boundaries",
          paint: {
            "raster-opacity": 0.7, // Semi-transparente para no ocultar satélite
          },
        },
      ],
    }),
    [],
  );

  // Estilo terreno/topográfico
  const terrainStyle = useMemo(
    () => ({
      version: 8,
      glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
      sources: {
        terrain: {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution: "© Esri, USGS, NOAA",
        },
        labels: {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution: "© Esri",
        },
      },
      layers: [
        {
          id: "background",
          type: "background",
          paint: {
            "background-color": "#f0f8ff",
          },
        },
        {
          id: "terrain-layer",
          type: "raster",
          source: "terrain",
          paint: {
            "raster-opacity": 1.0,
          },
        },
        {
          id: "labels-layer",
          type: "raster",
          source: "labels",
          paint: {
            "raster-opacity": 0.8,
          },
        },
      ],
    }),
    [],
  );

  // Estilo callejero/carreteras
  const streetStyle = useMemo(
    () => ({
      version: 8,
      glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
      sources: {
        streets: {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution: "© Esri, HERE, Garmin, USGS, Intermap, INCREMENT P",
        },
      },
      layers: [
        {
          id: "background",
          type: "background",
          paint: {
            "background-color": "#f5f5f5",
          },
        },
        {
          id: "streets-layer",
          type: "raster",
          source: "streets",
          paint: {
            "raster-opacity": 1.0,
          },
        },
      ],
    }),
    [],
  );

  // Estilo vectorial limpio
  const vectorStyle = "https://demotiles.maplibre.org/style.json";

  const mapStyles = useMemo(
    () => ({
      // Estilos personalizados (raster)
      satellite: satelliteStyle,
      terrain: terrainStyle,
      street: streetStyle,

      // Estilos vectoriales externos
      vector: "https://demotiles.maplibre.org/style.json",
      openStreetMap:
        "https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/openStreetMap.json",
      arcgis_hybrid:
        "https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/arcgis_hybrid.json",

      // CartoCDN styles
      darkMatter: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      darkMatterNoLabels:
        "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",
      positron: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      positronNoLabels: "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
      voyager: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
      voyagerNoLabels: "https://basemaps.cartocdn.com/gl/voyager-nolabels-gl-style/style.json",

      // ICGC styles
      icgc: "https://geoserveis.icgc.cat/contextmaps/icgc.json",
      icgc_mapa_base_fosc: "https://geoserveis.icgc.cat/contextmaps/icgc_mapa_base_fosc.json",
      icgc_ombra_hipsometria_corbes:
        "https://geoserveis.icgc.cat/contextmaps/icgc_ombra_hipsometria_corbes.json",
      icgc_ombra_fosca: "https://geoserveis.icgc.cat/contextmaps/icgc_ombra_fosca.json",
      icgc_orto_estandard: "https://geoserveis.icgc.cat/contextmaps/icgc_orto_estandard.json",
      icgc_orto_estandard_gris:
        "https://geoserveis.icgc.cat/contextmaps/icgc_orto_estandard_gris.json",
      icgc_orto_hibrida: "https://geoserveis.icgc.cat/contextmaps/icgc_orto_hibrida.json",
      icgc_geologic_riscos: "https://geoserveis.icgc.cat/contextmaps/icgc_geologic_riscos.json",
    }),
    [satelliteStyle, terrainStyle, streetStyle],
  );

  // Grupos de estilos para organizar la UI
  const styleGroups = useMemo(
    () => [
      {
        name: "Básicos",
        styles: [
          { key: "satellite", label: "🛰️ Satélite", color: "green" },
          { key: "terrain", label: "🏔️ Terreno", color: "amber" },
          { key: "street", label: "🛣️ Calles", color: "blue" },
          { key: "vector", label: "🗺️ Vector", color: "purple" },
        ],
      },
      {
        name: "OpenStreetMap",
        styles: [
          { key: "openStreetMap", label: "🌍 OSM", color: "emerald" },
          { key: "arcgis_hybrid", label: "🗺️ ArcGIS Hybrid", color: "teal" },
        ],
      },
      {
        name: "CartoCDN",
        styles: [
          { key: "positron", label: "☀️ Positron", color: "slate" },
          { key: "positronNoLabels", label: "☀️ Positron Sin Etiquetas", color: "slate" },
          { key: "darkMatter", label: "🌙 Dark Matter", color: "gray" },
          { key: "darkMatterNoLabels", label: "🌙 Dark Matter Sin Etiquetas", color: "gray" },
          { key: "voyager", label: "⛵ Voyager", color: "cyan" },
          { key: "voyagerNoLabels", label: "⛵ Voyager Sin Etiquetas", color: "cyan" },
        ],
      },
      {
        name: "ICGC",
        styles: [
          { key: "icgc", label: "📍 ICGC", color: "orange" },
          { key: "icgc_mapa_base_fosc", label: "🌑 Base Fosca", color: "orange" },
          { key: "icgc_ombra_hipsometria_corbes", label: "⛰️ Hipsometría", color: "orange" },
          { key: "icgc_ombra_fosca", label: "🏔️ Ombra Fosca", color: "orange" },
          { key: "icgc_orto_estandard", label: "🛰️ Orto Estándar", color: "orange" },
          { key: "icgc_orto_estandard_gris", label: "⚫ Orto Gris", color: "orange" },
          { key: "icgc_orto_hibrida", label: "🗺️ Orto Híbrida", color: "orange" },
          { key: "icgc_geologic_riscos", label: "🪨 Geológico", color: "orange" },
        ],
      },
    ],
    [],
  );

  // Función para obtener el estilo actual
  const getCurrentMapStyle = useCallback(() => {
    return mapStyles[currentMapStyle] || mapStyles.satellite;
  }, [currentMapStyle, mapStyles]);

  // Memoizar capas para evitar re-renderizados
  const citiesLayerCircle = useMemo(
    () => ({
      id: "cities-circle",
      type: "circle",
      paint: {
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["get", "population"],
          1000000,
          8,
          15000000,
          20,
        ],
        "circle-color": "#ff6b6b",
        "circle-opacity": 0.8,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    }),
    [],
  );

  const citiesLayerLabel = useMemo(
    () => ({
      id: "cities-label",
      type: "symbol",
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Open Sans Semibold"],
        "text-size": 12,
        "text-offset": [0, 2],
        "text-anchor": "top",
      },
      paint: {
        "text-color": "#000000",
        "text-halo-color": "#ffffff",
        "text-halo-width": 1,
      },
    }),
    [],
  );

  // Optimizar función de movimiento con useCallback
  const handleMove = useCallback((evt) => {
    setViewState(evt.viewState);
  }, []);

  // Optimizar cambio de proyección
  const handleProjectionChange = useCallback((newProjection) => {
    if (rotationRef.current) {
      cancelAnimationFrame(rotationRef.current);
      rotationRef.current = null;
    }
    setProjection(newProjection);
  }, []);

  // Optimizar navegación a ciudades
  const navigateToCity = useCallback((city) => {
    setViewState((prev) => ({
      ...prev,
      longitude: city.geometry.coordinates[0],
      latitude: city.geometry.coordinates[1],
      zoom: 8,
    }));
  }, []);

  return (
    <div className="w-full h-screen relative map-with-starry-bg">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={handleMove}
        mapStyle={getCurrentMapStyle()}
        projection={projection}
        style={{ width: "100%", height: "100%" }}
        maxZoom={18}
        minZoom={1}
        // Optimizaciones de rendimiento
        antialias={true}
        preserveDrawingBuffer={false}
        failIfMajorPerformanceCaveat={false}
        transitionDuration={200}
        transitionInterpolator={null}
        renderWorldCopies={false}
        reuseMaps={true}
        // Configuraciones de interacción
        dragRotate={true}
        doubleClickZoom={true}
        keyboard={true}
        scrollZoom={true}
        touchZoom={true}
        touchRotate={true}
      >
        {/* Fuente de datos de ciudades */}
        <Source id="cities" type="geojson" data={citiesData}>
          <Layer {...citiesLayerCircle} />
          <Layer {...citiesLayerLabel} />
        </Source>

        {/* Controles */}
        <NavigationControl position="top-right" visualizePitch={true} />
        <GeolocateControl position="top-left" />

        {/* Panel de controles personalizados optimizado */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 space-y-2 backdrop-blur-sm bg-opacity-95">
          <h3 className="font-semibold text-sm mb-2">Controles del Globo</h3>

          {/* Botones de proyección */}
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => handleProjectionChange("globe")}
              className={`px-3 py-1 text-xs rounded transition-colors duration-200 ${projection === "globe" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              disabled={projection === "globe"}
            >
              🌍 Globo
            </button>
            <button
              onClick={() => handleProjectionChange("mercator")}
              className={`px-3 py-1 text-xs rounded transition-colors duration-200 ${
                projection === "mercator"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              disabled={projection === "mercator"}
            >
              🗺️ Plano
            </button>
          </div>

          {/* Control de estilo de mapa */}
          <div className="border-t pt-2">
            <p className="text-xs font-medium mb-1">Estilo del Mapa:</p>
            <div className="grid grid-cols-2 gap-1">
              {Object.entries(mapStyles).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setCurrentMapStyle(key)}
                  className={`px-2 py-1 text-xs rounded transition-colors duration-150 ${
                    currentMapStyle === value
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          {/* Botones de navegación rápida */}
          <div className="space-y-1 border-t pt-2">
            <p className="text-xs font-medium">Ir a:</p>
            <div className="grid grid-cols-2 gap-1">
              {citiesData.features.map((city, index) => (
                <button
                  key={`${city.properties.name}-${index}`}
                  onClick={() => navigateToCity(city)}
                  className="px-2 py-1 text-xs bg-gray-700 text-white hover:bg-gray-500 rounded transition-colors duration-150"
                >
                  {city.properties.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Información del estado actual optimizada */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <span>Zoom: {viewState.zoom.toFixed(1)}</span>
            <span>|</span>
            <span>{projection === "globe" ? "🌍 Globo" : "🗺️ Plano"}</span>
            <span>|</span>
            <span>
              {currentMapStyle === "satellite" && "🛰️ Satélite"}
              {currentMapStyle === "terrain" && "🏔️ Terreno"}
              {currentMapStyle === "street" && "🛣️ Calles"}
              {currentMapStyle === "vector" && "🗺️ Vector"}
            </span>
          </div>
        </div>
      </Map>
    </div>
  );
};

export default AdvancedGlobeMapV2;
