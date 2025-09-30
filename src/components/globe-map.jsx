"use client";

import { useCallback, useMemo, useState } from "react";
import Map, { GeolocateControl, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

const GlobeMap = () => {
    const [viewState, setViewState] = useState({
        longitude: -78.5, // --> ACTUALIZADO: Centrado en Cajamarca, Perú
        latitude: -7.1, // --> ACTUALIZADO: Centrado en Cajamarca, Perú
        zoom: 5,
        pitch: 0,
        bearing: 0,
    });

    // --> AÑADIDO: Obtenemos una fecha reciente para la capa de la NASA.
    // GIBS puede tardar 1-2 días en procesar los datos, así que usamos el día de antier.
    const date = new Date();
    date.setDate(date.getDate() - 2);
    const nasaDateString = date.toISOString().split("T")[0];

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
                // --> AÑADIDO: Nueva fuente de datos para la capa NDVI de la NASA (GIBS)
                "nasa-gibs-ndvi": {
                    type: "raster",
                    tiles: [`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_NDVI_8Day/default/${nasaDateString}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png`],
                    tileSize: 256,
                    attribution: "NASA Global Imagery Browse Services (GIBS)",
                },
            },
            layers: [
                {
                    id: "osm-tiles-layer",
                    type: "raster",
                    source: "osm-tiles",
                },
                // --> AÑADIDO: Nueva capa para visualizar los datos NDVI sobre el mapa base
                {
                    id: "nasa-gibs-ndvi-layer",
                    type: "raster",
                    source: "nasa-gibs-ndvi",
                    paint: {
                        "raster-opacity": 0.6, // Le damos algo de transparencia para ver el mapa de abajo
                    },
                },
            ],
        }),
        [nasaDateString] // --> ACTUALIZADO: El estilo depende de la fecha
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
                antialias={true}
                preserveDrawingBuffer={false}
                failIfMajorPerformanceCaveat={false}
                transitionDuration={200}
                transitionInterpolator={null}
                renderWorldCopies={false}
                dragRotate={true}
                doubleClickZoom={true}
                keyboard={true}
                scrollZoom={true}
                touchZoom={true}
                touchRotate={true}
            >
                <NavigationControl position="top-right" visualizePitch={true} />
                <GeolocateControl position="top-left" trackUserLocation showUserHeading />
            </Map>
        </div>
    );
};

export default GlobeMap;
