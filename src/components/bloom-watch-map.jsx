"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import Map, { NavigationControl, GeolocateControl, Source, Layer } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import useBloomWatchMapStyles from "@/hooks/use-select-styles";

const BloomWatchMap = () => {
    const mapRef = useRef();
    const { mapStyles, currentStyle, currentMapStyle, changeStyle, availableStyles } = useBloomWatchMapStyles();

    const [viewState, setViewState] = useState({
        longitude: -74.5,
        latitude: 40,
        zoom: 2,
        pitch: 0,
        bearing: 0,
    });

    // Datos de ejemplo para floración (reemplazar con datos reales de NASA)
    const bloomingData = useMemo(
        () => ({
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    geometry: { type: "Point", coordinates: [-74.006, 40.7128] },
                    properties: {
                        name: "Nueva York",
                        bloomStatus: "peak",
                        species: "Cerezo",
                        bloomDate: "2024-04-15",
                    },
                },
                {
                    type: "Feature",
                    geometry: { type: "Point", coordinates: [2.3522, 48.8566] },
                    properties: {
                        name: "París",
                        bloomStatus: "early",
                        species: "Castaño",
                        bloomDate: "2024-03-20",
                    },
                },
                {
                    type: "Feature",
                    geometry: { type: "Point", coordinates: [139.6503, 35.6762] },
                    properties: {
                        name: "Tokio",
                        bloomStatus: "full",
                        species: "Sakura",
                        bloomDate: "2024-03-25",
                    },
                },
            ],
        }),
        []
    );

    // Optimizar función de movimiento
    const handleMove = useCallback((evt) => {
        setViewState(evt.viewState);
    }, []);

    // Capas para visualizar datos de floración
    const bloomLayer = useMemo(
        () => ({
            id: "bloom-points",
            type: "circle",
            paint: {
                "circle-radius": ["case", ["==", ["get", "bloomStatus"], "peak"], 12, ["==", ["get", "bloomStatus"], "full"], 10, ["==", ["get", "bloomStatus"], "early"], 8, 6],
                "circle-color": [
                    "case",
                    ["==", ["get", "bloomStatus"], "peak"],
                    "#ff1493", // Rosa intenso
                    ["==", ["get", "bloomStatus"], "full"],
                    "#ff69b4", // Rosa medio
                    ["==", ["get", "bloomStatus"], "early"],
                    "#ffb6c1", // Rosa claro
                    "#90ee90", // Verde claro para otros
                ],
                "circle-opacity": 0.8,
                "circle-stroke-width": 2,
                "circle-stroke-color": "#ffffff",
            },
        }),
        []
    );

    const bloomLabelLayer = useMemo(
        () => ({
            id: "bloom-labels",
            type: "symbol",
            layout: {
                "text-field": ["concat", ["get", "name"], "\n🌸 ", ["get", "species"]],
                "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
                "text-size": 11,
                "text-offset": [0, 2],
                "text-anchor": "top",
            },
            paint: {
                "text-color": "#2d5016",
                "text-halo-color": "#ffffff",
                "text-halo-width": 2,
            },
        }),
        []
    );

    return (
        <div className="w-full h-screen relative">
            <Map
                ref={mapRef}
                {...viewState}
                onMove={handleMove}
                mapStyle={currentMapStyle.style}
                projection="globe"
                style={{ width: "100%", height: "100%" }}
                maxZoom={18}
                minZoom={1}
                // Optimizaciones de rendimiento
                antialias={true}
                preserveDrawingBuffer={false}
                transitionDuration={300}
                reuseMaps={true}
            >
                {/* Datos de floración */}
                <Source id="blooming-data" type="geojson" data={bloomingData}>
                    <Layer {...bloomLayer} />
                    <Layer {...bloomLabelLayer} />
                </Source>

                {/* Controles estándar */}
                <NavigationControl position="top-right" visualizePitch={true} />
                <GeolocateControl position="top-left" />

                {/* Selector de estilos BloomWatch */}
                <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 space-y-3 backdrop-blur-sm bg-opacity-95 max-w-xs">
                    <div className="flex items-center space-x-2">
                        <span className="text-lg">🌸</span>
                        <h3 className="font-bold text-sm">BloomWatch Estilos</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {availableStyles.map((styleName) => {
                            const style = mapStyles[styleName];
                            return (
                                <button
                                    key={styleName}
                                    onClick={() => changeStyle(styleName)}
                                    className={`p-2 text-xs rounded-md border transition-all duration-200 ${
                                        currentStyle === styleName
                                            ? "bg-green-500 text-white border-green-600 shadow-md"
                                            : "bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:bg-green-50"
                                    }`}
                                >
                                    <div className="font-medium">{style.name}</div>
                                    <div className="text-xs opacity-75 mt-1">{style.description}</div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Leyenda de estados de floración */}
                    <div className="border-t pt-2 mt-3">
                        <p className="text-xs font-medium mb-2">Estados de Floración:</p>
                        <div className="space-y-1 text-xs">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-pink-600"></div>
                                <span>Pico de floración</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-pink-400"></div>
                                <span>Floración completa</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-pink-200"></div>
                                <span>Floración temprana</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-green-300"></div>
                                <span>Sin floración</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Información del estado actual */}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg text-sm backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                        <span>🌸 BloomWatch</span>
                        <span>|</span>
                        <span>Estilo: {mapStyles[currentStyle].name}</span>
                        <span>|</span>
                        <span>Zoom: {viewState.zoom.toFixed(1)}</span>
                    </div>
                </div>

                {/* Panel de información NASA */}
                <div className="absolute top-4 right-4 bg-blue-900 bg-opacity-90 text-white p-3 rounded-lg text-xs max-w-sm backdrop-blur-sm">
                    <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">🛰️</span>
                        <span className="font-bold">NASA Space Apps 2025</span>
                    </div>
                    <p>Usa datos satelitales para monitorear patrones de floración global y predecir cambios fenológicos.</p>
                </div>
            </Map>
        </div>
    );
};

export default BloomWatchMap;
