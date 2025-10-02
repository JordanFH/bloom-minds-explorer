"use client";

import { useCallback, useMemo, useState } from "react";
import Map, { GeolocateControl, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import Legend from "./legend";

const GlobeMap = () => {
    const [viewState, setViewState] = useState({
        longitude: -78.5,
        latitude: -7.1,
        zoom: 5,
        pitch: 0,
        bearing: 0,
    });

    const date = new Date();
    date.setDate(date.getDate() - 2);
    const nasaDateString = date.toISOString().split("T")[0];

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
                {
                    id: "nasa-gibs-ndvi-layer",
                    type: "raster",
                    source: "nasa-gibs-ndvi",
                    paint: {
                        "raster-opacity": 0.6,
                    },
                },
            ],
        }),
        [nasaDateString]
    );

    const handleMove = useCallback((evt) => {
        setViewState(evt.viewState);
    }, []);

    return (
        // --> PASO 2: AÑADE `position: 'relative'` AL CONTENEDOR
        <div className="w-full h-screen" style={{ position: "relative" }}>
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

            {/* --> PASO 3: COLOCA EL COMPONENTE DE LA LEYENDA AQUÍ */}
            <Legend />
        </div>
    );
};

export default GlobeMap;
