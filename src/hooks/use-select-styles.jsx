"use client";

import { useState, useCallback, useMemo } from "react";

// Estilos de mapa especializados para BloomWatch
const useBloomWatchMapStyles = () => {
    const [currentStyle, setCurrentStyle] = useState("vegetation");

    const mapStyles = useMemo(
        () => ({
            // 🌱 Estilo Vegetación - Ideal para mostrar datos de floración
            vegetation: {
                name: "🌱 Vegetación",
                description: "Resalta áreas verdes y vegetación",
                style: {
                    version: 8,
                    glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
                    sources: {
                        "esri-world": {
                            type: "raster",
                            tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
                            tileSize: 256,
                            attribution: "© Esri",
                        },
                    },
                    layers: [
                        {
                            id: "background",
                            type: "background",
                            paint: { "background-color": "#2d5016" }, // Verde oscuro para resaltar floración
                        },
                        {
                            id: "satellite-layer",
                            type: "raster",
                            source: "esri-world",
                            paint: {
                                "raster-opacity": 0.8,
                                "raster-saturation": 1.2, // Aumenta saturación para vegetación
                            },
                        },
                    ],
                },
            },

            // 🛰️ Estilo Satélite - Para análisis detallado de imágenes
            satellite: {
                name: "🛰️ Satélite",
                description: "Imágenes satelitales de alta resolución",
                style: {
                    version: 8,
                    glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
                    sources: {
                        "esri-satellite": {
                            type: "raster",
                            tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
                            tileSize: 256,
                            attribution: "© Esri, DigitalGlobe, GeoEye",
                        },
                    },
                    layers: [
                        {
                            id: "satellite-layer",
                            type: "raster",
                            source: "esri-satellite",
                        },
                    ],
                },
            },

            // 🗺️ Estilo Terreno - Para contexto topográfico
            terrain: {
                name: "🗺️ Terreno",
                description: "Relieve y características geográficas",
                style: {
                    version: 8,
                    glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
                    sources: {
                        terrain: {
                            type: "raster",
                            tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}"],
                            tileSize: 256,
                            attribution: "© Esri",
                        },
                    },
                    layers: [
                        {
                            id: "background",
                            type: "background",
                            paint: { "background-color": "#f5f5dc" }, // Beige claro
                        },
                        {
                            id: "terrain-layer",
                            type: "raster",
                            source: "terrain",
                        },
                    ],
                },
            },

            // 🌍 Estilo Científico - Optimizado para datos científicos
            scientific: {
                name: "🌍 Científico",
                description: "Fondo neutro para datos científicos",
                style: {
                    version: 8,
                    glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
                    sources: {
                        "carto-light": {
                            type: "raster",
                            tiles: ["https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"],
                            tileSize: 256,
                            attribution: "© CartoDB",
                        },
                    },
                    layers: [
                        {
                            id: "background",
                            type: "background",
                            paint: { "background-color": "#ffffff" },
                        },
                        {
                            id: "carto-layer",
                            type: "raster",
                            source: "carto-light",
                            paint: {
                                "raster-opacity": 0.7, // Más transparente para datos overlay
                            },
                        },
                    ],
                },
            },

            // 🌙 Estilo Oscuro - Para visualizaciones nocturnas o menos distracción
            dark: {
                name: "🌙 Oscuro",
                description: "Fondo oscuro, ideal para datos brillantes",
                style: {
                    version: 8,
                    glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
                    sources: {
                        "carto-dark": {
                            type: "raster",
                            tiles: ["https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"],
                            tileSize: 256,
                            attribution: "© CartoDB",
                        },
                    },
                    layers: [
                        {
                            id: "background",
                            type: "background",
                            paint: { "background-color": "#1a1a1a" },
                        },
                        {
                            id: "carto-dark-layer",
                            type: "raster",
                            source: "carto-dark",
                        },
                    ],
                },
            },

            // 🌸 Estilo Floración - Especializado para datos de floración
            bloom: {
                name: "🌸 Floración",
                description: "Optimizado para visualizar patrones de floración",
                style: {
                    version: 8,
                    glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
                    sources: {
                        osm: {
                            type: "raster",
                            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
                            tileSize: 256,
                            attribution: "© OpenStreetMap contributors",
                        },
                    },
                    layers: [
                        {
                            id: "background",
                            type: "background",
                            paint: {
                                "background-color": "#f0f8f0", // Verde muy claro para floración
                            },
                        },
                        {
                            id: "osm-layer",
                            type: "raster",
                            source: "osm",
                            paint: {
                                "raster-opacity": 0.6,
                                "raster-hue-rotate": 30, // Ligero tinte hacia verdes/amarillos
                                "raster-brightness-max": 0.9,
                            },
                        },
                    ],
                },
            },
        }),
        []
    );

    const changeStyle = useCallback(
        (styleName) => {
            if (mapStyles[styleName]) {
                setCurrentStyle(styleName);
            }
        },
        [mapStyles]
    );

    return {
        mapStyles,
        currentStyle,
        currentMapStyle: mapStyles[currentStyle],
        changeStyle,
        availableStyles: Object.keys(mapStyles),
    };
};

export default useBloomWatchMapStyles;
