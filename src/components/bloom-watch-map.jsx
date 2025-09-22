"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import Map, { NavigationControl, GeolocateControl, Source, Layer } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import useBloomWatchMapStyles from "@/hooks/use-select-styles";
import { useVegetationLayers, useBloomRegions } from "@/hooks/use-nasa-vegetation";

const BloomWatchMap = () => {
    const mapRef = useRef();
    const { mapStyles, currentStyle, currentMapStyle, changeStyle, availableStyles } = useBloomWatchMapStyles();

    // NASA vegetation data integration
    const {
        currentLayer: nasaLayer,
        activeLayer,
        mapSource: nasaSource,
        layerStyle: nasaLayerStyle,
        changeLayer: changeNasaLayer,
        availableLayers: nasaLayers,
        isLoading: nasaLoading,
        error: nasaError
    } = useVegetationLayers({ defaultLayer: 'ndvi', autoUpdate: true });

    // Bloom regions data
    const {
        regions: bloomRegions,
        bloomingRegions,
        selectedRegion,
        selectRegion,
        analyzeRegion,
        isAnalyzing
    } = useBloomRegions();

    const [showNasaLayers, setShowNasaLayers] = useState(true);
    const [selectedBloomPoint, setSelectedBloomPoint] = useState(null);

    const [viewState, setViewState] = useState({
        longitude: -74.5,
        latitude: 40,
        zoom: 2,
        pitch: 0,
        bearing: 0,
    });

    // NASA bloom regions data
    const bloomingData = useMemo(
        () => ({
            type: "FeatureCollection",
            features: bloomRegions.map(region => ({
                type: "Feature",
                geometry: region.coordinates,
                properties: {
                    name: region.name,
                    bloomStatus: region.bloomStatus,
                    species: region.species,
                    peakBloomMonth: region.peakBloomMonth,
                    isInBloomSeason: region.isInBloomSeason,
                    description: region.description
                }
            }))
        }),
        [bloomRegions]
    );

    // Optimizar función de movimiento
    const handleMove = useCallback((evt) => {
        setViewState(evt.viewState);
    }, []);

    // Handle bloom point clicks
    const handleBloomPointClick = useCallback((event) => {
        const feature = event.features?.[0];
        if (feature) {
            setSelectedBloomPoint(feature.properties);
            selectRegion(feature.properties.name);
        }
    }, [selectRegion]);

    // Navigate to bloom region
    const navigateToRegion = useCallback((region) => {
        const coords = region.coordinates.type === 'Point'
            ? region.coordinates.coordinates
            : region.coordinates.coordinates[0][0]; // First coordinate of polygon

        setViewState(prev => ({
            ...prev,
            longitude: coords[0],
            latitude: coords[1],
            zoom: 8,
            transitionDuration: 1000
        }));
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
                onClick={handleBloomPointClick}
                interactiveLayerIds={['bloom-points']}
            >
                {/* NASA vegetation layers */}
                {showNasaLayers && nasaSource && (
                    <Source id="nasa-vegetation" type="raster" {...nasaSource}>
                        <Layer {...nasaLayerStyle} />
                    </Source>
                )}

                {/* Bloom regions data */}
                <Source id="blooming-data" type="geojson" data={bloomingData}>
                    <Layer {...bloomLayer} />
                    <Layer {...bloomLabelLayer} />
                </Source>

                {/* Controles estándar */}
                <NavigationControl position="top-right" visualizePitch={true} />
                <GeolocateControl position="top-left" />

                {/* Enhanced BloomWatch Controls */}
                <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 space-y-3 backdrop-blur-sm bg-opacity-95 max-w-xs">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-lg">🌸</span>
                            <h3 className="font-bold text-sm">BloomWatch</h3>
                        </div>
                        {nasaLoading && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                        )}
                    </div>

                    {/* NASA Layer Toggle */}
                    <div className="border-b pb-2">
                        <label className="flex items-center space-x-2 text-sm">
                            <input
                                type="checkbox"
                                checked={showNasaLayers}
                                onChange={(e) => setShowNasaLayers(e.target.checked)}
                                className="rounded"
                            />
                            <span>NASA Vegetation Data</span>
                        </label>
                    </div>

                    {/* NASA Layers Selection */}
                    {showNasaLayers && (
                        <div className="space-y-2">
                            <p className="text-xs font-medium">NASA Vegetation Layers:</p>
                            <div className="grid grid-cols-1 gap-1">
                                {nasaLayers.map((layer) => (
                                    <button
                                        key={layer.id}
                                        onClick={() => changeNasaLayer(layer.id)}
                                        className={`p-2 text-xs rounded-md border transition-all duration-200 ${
                                            nasaLayer === layer.id
                                                ? "bg-blue-500 text-white border-blue-600"
                                                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50"
                                        }`}
                                    >
                                        <div className="font-medium">{layer.name}</div>
                                        <div className="text-xs opacity-75 mt-1">{layer.description}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Base Map Styles */}
                    <div className="border-t pt-2">
                        <p className="text-xs font-medium mb-2">Base Map Style:</p>
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
                    </div>

                    {/* Bloom Regions Navigation */}
                    <div className="border-t pt-2">
                        <p className="text-xs font-medium mb-2">Bloom Regions ({bloomingRegions.length} active):</p>
                        <div className="space-y-1">
                            {bloomRegions.slice(0, 4).map((region) => (
                                <button
                                    key={region.name}
                                    onClick={() => navigateToRegion(region)}
                                    className={`w-full p-2 text-xs rounded border transition-colors ${
                                        region.isInBloomSeason
                                            ? "bg-pink-50 border-pink-200 text-pink-800"
                                            : "bg-gray-50 border-gray-200 text-gray-600"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{region.name}</span>
                                        <span className={`w-2 h-2 rounded-full ${
                                            region.isInBloomSeason ? "bg-pink-500" : "bg-gray-300"
                                        }`}></span>
                                    </div>
                                    <div className="text-xs opacity-75 mt-1">{region.species}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="border-t pt-2 mt-3">
                        <p className="text-xs font-medium mb-2">Legend:</p>
                        <div className="space-y-1 text-xs">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-pink-600"></div>
                                <span>Active bloom season</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                                <span>Dormant season</span>
                            </div>
                            {activeLayer && (
                                <div className="flex items-center space-x-2 mt-2 p-2 bg-blue-50 rounded">
                                    <span className="text-blue-800 font-medium">NASA: {activeLayer.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg text-sm backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                        <span>🌸 BloomWatch</span>
                        <span>|</span>
                        <span>Base: {mapStyles[currentStyle].name}</span>
                        {showNasaLayers && activeLayer && (
                            <>
                                <span>|</span>
                                <span>NASA: {activeLayer.name}</span>
                            </>
                        )}
                        <span>|</span>
                        <span>Zoom: {viewState.zoom.toFixed(1)}</span>
                        {nasaError && (
                            <>
                                <span>|</span>
                                <span className="text-red-400">Data Error</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Selected Region Info */}
                {selectedBloomPoint && (
                    <div className="absolute bottom-4 right-4 bg-white bg-opacity-95 p-4 rounded-lg shadow-lg max-w-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-sm">{selectedBloomPoint.name}</h4>
                            <button
                                onClick={() => setSelectedBloomPoint(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-1 text-xs">
                            <div><strong>Species:</strong> {selectedBloomPoint.species}</div>
                            <div><strong>Status:</strong>
                                <span className={`ml-1 px-2 py-1 rounded ${
                                    selectedBloomPoint.isInBloomSeason
                                        ? "bg-pink-100 text-pink-800"
                                        : "bg-gray-100 text-gray-600"
                                }`}>
                                    {selectedBloomPoint.isInBloomSeason ? 'In Season' : 'Dormant'}
                                </span>
                            </div>
                            <div><strong>Peak Month:</strong> {new Date(0, selectedBloomPoint.peakBloomMonth - 1).toLocaleString('default', { month: 'long' })}</div>
                            <div className="mt-2 text-xs text-gray-600">{selectedBloomPoint.description}</div>
                            {selectedRegion && (
                                <button
                                    onClick={() => analyzeRegion(selectedRegion)}
                                    disabled={isAnalyzing}
                                    className="mt-2 w-full bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {isAnalyzing ? 'Analyzing...' : 'Analyze with NASA Data'}
                                </button>
                            )}
                        </div>
                    </div>
                )}

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
