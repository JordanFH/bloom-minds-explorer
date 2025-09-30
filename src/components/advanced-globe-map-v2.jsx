"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Map, { GeolocateControl, Layer, NavigationControl, Source } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

// ==================== HOOKS PERSONALIZADOS ====================

// Hook para manejar los datos de las ciudades
const useCitiesData = () => {
  return useMemo(
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
};

// Hook para manejar los estilos de mapa
const useMapStyles = () => {
  const satelliteStyle = useMemo(
    () => ({
      version: 8,
      glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
      sources: {
        satellite: {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution: "© Esri, DigitalGlobe, GeoEye",
        },
        boundaries: {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution: "© Esri",
        },
      },
      layers: [
        {
          id: "background",
          type: "background",
          paint: { "background-color": "#000000" },
        },
        {
          id: "satellite-layer",
          type: "raster",
          source: "satellite",
          paint: {
            "raster-opacity": 1.0,
            "raster-contrast": 0.1,
          },
        },
        {
          id: "boundaries-layer",
          type: "raster",
          source: "boundaries",
          paint: { "raster-opacity": 0.7 },
        },
      ],
    }),
    [],
  );

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
        },
        labels: {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
        },
      },
      layers: [
        {
          id: "background",
          type: "background",
          paint: { "background-color": "#f0f8ff" },
        },
        {
          id: "terrain-layer",
          type: "raster",
          source: "terrain",
        },
        {
          id: "labels-layer",
          type: "raster",
          source: "labels",
          paint: { "raster-opacity": 0.8 },
        },
      ],
    }),
    [],
  );

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
        },
      },
      layers: [
        {
          id: "background",
          type: "background",
          paint: { "background-color": "#f5f5f5" },
        },
        {
          id: "streets-layer",
          type: "raster",
          source: "streets",
        },
      ],
    }),
    [],
  );

  return useMemo(
    () => ({
      satellite: satelliteStyle,
      terrain: terrainStyle,
      street: streetStyle,
      vector: "https://demotiles.maplibre.org/style.json",
      openStreetMap:
        "https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/openStreetMap.json",
      arcgis_hybrid:
        "https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/arcgis_hybrid.json",
      darkMatter: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      darkMatterNoLabels:
        "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",
      positron: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      positronNoLabels: "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
      voyager: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
      voyagerNoLabels: "https://basemaps.cartocdn.com/gl/voyager-nolabels-gl-style/style.json",
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
};

// Hook para grupos de estilos
const useStyleGroups = () => {
  return useMemo(
    () => [
      {
        name: "Básicos",
        styles: [
          { key: "satellite", label: "🛰️ Satélite" },
          { key: "terrain", label: "🏔️ Terreno" },
          { key: "street", label: "🛣️ Calles" },
          { key: "vector", label: "🗺️ Vector" },
        ],
      },
      //   {
      //     name: "OpenStreetMap",
      //     styles: [
      //       { key: "openStreetMap", label: "🌍 OSM" },
      //       { key: "arcgis_hybrid", label: "🗺️ ArcGIS Hybrid" },
      //     ],
      //   },
      {
        name: "CartoCDN",
        styles: [
          { key: "positron", label: "☀️ Positron" },
          { key: "positronNoLabels", label: "☀️ Positron Sin Etiquetas" },
          { key: "darkMatter", label: "🌙 Dark Matter" },
          { key: "darkMatterNoLabels", label: "🌙 Dark Matter Sin Etiquetas" },
          { key: "voyager", label: "⛵ Voyager" },
          { key: "voyagerNoLabels", label: "⛵ Voyager Sin Etiquetas" },
        ],
      },
      {
        name: "ICGC",
        styles: [
          { key: "icgc", label: "📍 ICGC" },
          { key: "icgc_mapa_base_fosc", label: "🌑 Base Fosca" },
          //   { key: "icgc_ombra_hipsometria_corbes", label: "⛰️ Hipsometría" },
          //   { key: "icgc_ombra_fosca", label: "🏔️ Ombra Fosca" },
          //   { key: "icgc_orto_estandard", label: "🛰️ Orto Estándar" },
          { key: "icgc_orto_estandard_gris", label: "⚫ Orto Gris" },
          { key: "icgc_orto_hibrida", label: "🗺️ Orto Híbrida" },
          //   { key: "icgc_geologic_riscos", label: "🪨 Geológico" },
        ],
      },
    ],
    [],
  );
};

// Hook para capas de ciudades
const useCityLayers = () => {
  const circleLayer = useMemo(
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

  const labelLayer = useMemo(
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

  return { circleLayer, labelLayer };
};

// ==================== COMPONENTES ====================

// Componente de botones de proyección
const ProjectionControls = ({ projection, onProjectionChange }) => {
  return (
    <div className="mb-3">
      <p className="text-xs font-semibold mb-2 text-gray-700">Proyección:</p>
      <div className="flex gap-2">
        <button
          onClick={() => onProjectionChange("globe")}
          className={`flex-1 px-3 py-2 text-xs rounded font-medium transition-all ${
            projection === "globe"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          🌍 Globo
        </button>
        <button
          onClick={() => onProjectionChange("mercator")}
          className={`flex-1 px-3 py-2 text-xs rounded font-medium transition-all ${
            projection === "mercator"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          🗺️ Plano
        </button>
      </div>
    </div>
  );
};

// Componente de grupo de estilos
const StyleGroup = ({ group, currentMapStyle, onStyleChange }) => {
  return (
    <div className="mb-3 pb-3 border-b border-gray-200 last:border-b-0">
      <p className="text-xs font-semibold mb-2 text-gray-700">{group.name}:</p>
      <div className="grid grid-cols-2 gap-1">
        {group.styles.map((style) => (
          <button
            key={style.key}
            onClick={() => onStyleChange(style.key)}
            className={`px-2 py-1.5 text-xs rounded font-medium transition-all ${
              currentMapStyle === style.key
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {style.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Componente de navegación a ciudades
const CityNavigation = ({ cities, onCityClick }) => {
  return (
    <div className="pt-3 border-t border-gray-200">
      <p className="text-xs font-semibold mb-2 text-gray-700">Ir a ciudad:</p>
      <div className="grid grid-cols-2 gap-1">
        {cities.map((city) => (
          <button
            key={city.properties.name}
            onClick={() => onCityClick(city)}
            className="px-2 py-1.5 text-xs bg-gray-800 text-white hover:bg-gray-700 rounded font-medium transition-all"
          >
            {city.properties.name}
          </button>
        ))}
      </div>
    </div>
  );
};

// Componente de panel de controles
const ControlPanel = ({
  projection,
  onProjectionChange,
  styleGroups,
  currentMapStyle,
  onStyleChange,
  cities,
  onCityClick,
}) => {
  return (
    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-xl p-4 max-h-[90vh] overflow-y-auto w-64 z-10">
      <h3 className="font-bold text-base mb-3 sticky top-0 bg-white pb-2">Controles del Globo</h3>

      <ProjectionControls projection={projection} onProjectionChange={onProjectionChange} />

      {styleGroups.map((group) => (
        <StyleGroup
          key={group.name}
          group={group}
          currentMapStyle={currentMapStyle}
          onStyleChange={onStyleChange}
        />
      ))}

      <CityNavigation cities={cities} onCityClick={onCityClick} />
    </div>
  );
};

// Componente de información de estado
const MapStatusInfo = ({ viewState, projection, currentMapStyle }) => {
  const getStyleLabel = (styleKey) => {
    const labels = {
      satellite: "🛰️ Satélite",
      terrain: "🏔️ Terreno",
      street: "🛣️ Calles",
      vector: "🗺️ Vector",
    };
    return labels[styleKey] || styleKey;
  };

  return (
    <div className="absolute bottom-4 left-4 bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg text-xs backdrop-blur-sm z-10">
      <div className="flex items-center gap-3">
        <span className="font-mono">Zoom: {viewState.zoom.toFixed(1)}</span>
        <span>•</span>
        <span>{projection === "globe" ? "🌍 Globo" : "🗺️ Plano"}</span>
        <span>•</span>
        <span>{getStyleLabel(currentMapStyle)}</span>
      </div>
    </div>
  );
};

// Componente de capas de ciudades
const CitiesLayer = ({ citiesData, circleLayer, labelLayer }) => {
  return (
    <Source id="cities" type="geojson" data={citiesData}>
      <Layer {...circleLayer} />
      <Layer {...labelLayer} />
    </Source>
  );
};

// ==================== COMPONENTE PRINCIPAL ====================

const AdvancedGlobeMapV2 = () => {
  const mapRef = useRef();
  const [viewState, setViewState] = useState({
    longitude: -74.5,
    latitude: 40,
    zoom: 2,
    pitch: 0,
    bearing: 0,
  });
  const [projection, setProjection] = useState("globe");
  const [currentMapStyle, setCurrentMapStyle] = useState("satellite");

  // Usar hooks personalizados
  const citiesData = useCitiesData();
  const mapStyles = useMapStyles();
  const styleGroups = useStyleGroups();
  const { circleLayer, labelLayer } = useCityLayers();

  // Callbacks optimizados
  const getCurrentMapStyle = useCallback(() => {
    return mapStyles[currentMapStyle] || mapStyles.satellite;
  }, [currentMapStyle, mapStyles]);

  const handleMove = useCallback((evt) => {
    setViewState(evt.viewState);
  }, []);

  const handleProjectionChange = useCallback((newProjection) => {
    setProjection(newProjection);
  }, []);

  const handleStyleChange = useCallback((styleKey) => {
    setCurrentMapStyle(styleKey);
  }, []);

  const navigateToCity = useCallback((city) => {
    setViewState((prev) => ({
      ...prev,
      longitude: city.geometry.coordinates[0],
      latitude: city.geometry.coordinates[1],
      zoom: 8,
      transitionDuration: 1000,
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
        antialias={true}
        preserveDrawingBuffer={false}
        renderWorldCopies={false}
        reuseMaps={true}
      >
        <CitiesLayer citiesData={citiesData} circleLayer={circleLayer} labelLayer={labelLayer} />

        <NavigationControl position="top-right" visualizePitch={true} />
        <GeolocateControl position="top-left" />

        <ControlPanel
          projection={projection}
          onProjectionChange={handleProjectionChange}
          styleGroups={styleGroups}
          currentMapStyle={currentMapStyle}
          onStyleChange={handleStyleChange}
          cities={citiesData.features}
          onCityClick={navigateToCity}
        />

        <MapStatusInfo
          viewState={viewState}
          projection={projection}
          currentMapStyle={currentMapStyle}
        />
      </Map>
    </div>
  );
};

export default AdvancedGlobeMapV2;
