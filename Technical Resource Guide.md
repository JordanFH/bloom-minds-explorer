# NASA Space Apps Challenge 2025 BloomWatch: Comprehensive Technical Resource Guide

NASA's Earth observation datasets and APIs provide unprecedented capabilities for monitoring global vegetation and flowering events. This comprehensive guide presents specific, actionable technical resources for building a web application that displays plant blooming events using react-map-gl with maplibre-gl, complete with URLs, API endpoints, and integration examples.

## NASA Earth observation datasets for vegetation monitoring

**MODIS vegetation indices represent the gold standard** for web-based vegetation monitoring, offering 20+ years of consistent data through multiple access methods. The **MOD13Q1 product delivers 250m resolution NDVI and EVI data** in 16-day composites, accessible via GIBS web services without authentication. **VIIRS products provide near real-time capabilities** with updates within 3-5 hours through the LANCE system, crucial for current blooming event detection.

### MODIS vegetation products

**LP DAAC serves as the primary portal** at https://lpdaac.usgs.gov/ with comprehensive MODIS vegetation indices. The **MOD13Q1 (250m, 16-day)** and **MOD13A1 (500m, 16-day)** products offer optimal spatial and temporal resolution for blooming detection. **Google Earth Engine integration** provides direct access via `MODIS/061/MOD13Q1` collections with JavaScript and Python APIs.

**Key API endpoints include:**
- CMR API: https://cmr.earthdata.nasa.gov/search/
- GIBS WMTS: `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi`
- AppEEARS API: https://appeears.earthdatacloud.nasa.gov/api/

**Technical specifications** support web integration with **HDF4 and NetCDF4 formats**, **16-day temporal composites**, and **free redistribution rights**. Authentication requires NASA Earthdata Login for data downloads, while GIBS visualization services operate without authentication.

### VIIRS real-time vegetation monitoring

**VIIRS LANCE services** provide the most current vegetation data through https://www.earthdata.nasa.gov/data/instruments/viirs/land-near-real-time-data. **VNP13A1 products deliver 500m resolution NDVI, EVI, and EVI2** indices with 16-day composites, while **VNP13A4N provides 8-day near real-time updates** within 3-5 hours of satellite observation.

**Integration benefits include:**
- Real-time bloom detection capabilities
- Consistent with MODIS products for historical analysis
- Compatible with GIBS web mapping services
- HDF5 and NetCDF4 formats optimized for cloud access

### Landsat Analysis Ready Data

**USGS EarthExplorer and STAC API** at https://landsatlook.usgs.gov/stac-server provide comprehensive Landsat access with **30m spatial resolution** and **16-day repeat cycles**. **Cloud Optimized GeoTIFF (COG) format** enables efficient web integration, while **ESPA On-Demand Interface** generates custom vegetation indices.

**AppEEARS integration** supports time series extraction for specific locations with automated processing. **AWS S3 access** via `s3://usgs-landsat` provides direct cloud-based data access for web applications.

### Advanced spectral datasets

**PACE mission delivers hyperspectral vegetation monitoring** through the Ocean Biology DAAC at https://oceancolor.gsfc.nasa.gov/data/find-data/. **Enhanced Vegetation Index (EVI) and specialized pigment indices** support detailed flowering analysis with **daily global coverage** and **100+ spectral bands**.

**EMIT spectral data** accessed through https://lpdaac.usgs.gov/data/get-started-data/collection-overview/missions/emit-overview/ provides **285-band hyperspectral imagery** for advanced vegetation stress analysis. **NetCDF4 format and 60m resolution** enable detailed phenological studies when combined with temporal analysis.

## NASA data portals and real-time APIs

**NASA GIBS represents the most accessible entry point** for web mapping integration, providing over 1,000 satellite imagery products through standard web services. **No authentication requirements** for visualization services enable immediate implementation, while **sub-hourly updates** support real-time monitoring applications.

### GIBS web mapping services

**Complete WMTS endpoints** support direct integration with react-map-gl:

```javascript
// MODIS NDVI integration example
const gibsUrl = 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi';
const layer = 'MODIS_Terra_NDVI_8Day';
const tileUrl = `${gibsUrl}?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${layer}&STYLE=default&TILEMATRIXSET=GoogleMapsCompatible_Level9&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image/png&TIME=${date}`;

map.addSource('ndvi-tiles', {
  type: 'raster',
  tiles: [tileUrl],
  tileSize: 256
});
```

**Available vegetation layers include:**
- MODIS Terra/Aqua NDVI 8-day and 16-day composites
- VIIRS vegetation indices with near real-time updates
- Land surface temperature products correlating with flowering
- Vegetation Continuous Fields for baseline mapping

### AppEEARS programmatic access

**AppEEARS API** at https://appeears.earthdatacloud.nasa.gov/api/ enables time series extraction for specific regions with comprehensive vegetation products. **Authentication workflow** uses NASA Earthdata Login with Bearer tokens:

```javascript
// AppEEARS authentication and data request
const loginResponse = await fetch('https://appeears.earthdatacloud.nasa.gov/api/login', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: 'grant_type=client_credentials'
});

const { token } = await loginResponse.json();

// Submit vegetation time series request
const taskRequest = {
  task_name: 'BloomWatch_Analysis',
  task_type: 'area',
  params: {
    dates: [{ startDate: '01-01-2023', endDate: '12-31-2023' }],
    layers: [
      { product: 'MOD13Q1.061', layer: 'NDVI' },
      { product: 'VNP13A1.001', layer: 'EVI2' }
    ],
    coordinates: [/* GeoJSON polygon */]
  }
};
```

### GLOBE Observer citizen science data

**GLOBE API** provides flowering observations from citizen scientists through https://api.globe.gov/search/swagger-ui.html#/. **GeoJSON format output** integrates directly with web mapping libraries:

```javascript
// Query flowering observations
const globeUrl = 'https://api.globe.gov/search/v1/measurement/protocol/measureddate/';
const params = {
  protocols: 'landcover',
  startdate: '2023-01-01',
  enddate: '2023-12-31',
  geojson: 'true',
  sample: 'false'
};

const floweringData = await fetch(`${globeUrl}?${new URLSearchParams(params)}`);
```

**No authentication required** for GLOBE data access, with **1 million record query limits** ensuring reliable performance for web applications.

## Technical web mapping integration resources

**React-map-gl compatibility requires vector tiles and properly configured CORS headers** for seamless integration. **Free basemap services** from CartoCDN and EOX provide global coverage without API keys, while **NASA GIBS offers specialized vegetation overlay capabilities**.

### Free basemap services for react-map-gl

**CartoCDN provides production-ready basemaps** with full CORS support:

```javascript
// CartoCDN integration
const basemapStyles = {
  positron: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  darkMatter: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  voyager: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
};

const map = new maplibregl.Map({
  container: 'map',
  style: basemapStyles.positron,
  center: [0, 0],
  zoom: 2
});
```

**EOX Sentinel-2 cloudless imagery** provides high-resolution global satellite basemaps:

```javascript
// High-resolution satellite basemap
map.addSource('sentinel2', {
  type: 'raster',
  tiles: ['https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg'],
  tileSize: 256
});
```

### Global vegetation boundaries

**Natural Earth Data** at http://www.naturalearthdata.com/ provides **public domain vector data** in multiple resolutions (1:10m, 1:50m, 1:110m). **Administrative boundaries and agricultural regions** support country/region selection functionality.

**Global Administrative Areas (GADM)** offers **detailed country subdivisions** through https://www.gadm.org/ with **38,735 total boundaries** across 5 administrative levels. **Free academic licensing** and **multiple format support** (Shapefile, GeoJSON, GeoPackage) enable flexible integration.

### Cloud-optimized satellite imagery

**NASA GIBS supports time dimension queries** enabling historical bloom analysis:

```javascript
// Time-enabled vegetation layer
const timeEnabledLayer = {
  id: 'vegetation-time-series',
  type: 'raster',
  source: {
    type: 'raster',
    tiles: [`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_NDVI_8Day/default/{time}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png`],
    tileSize: 256
  },
  layout: { 'visibility': 'visible' },
  paint: { 'raster-opacity': 0.8 }
};
```

**Cloud Optimized GeoTIFF (COG) access** through OpenGeoHub provides **250m resolution MODIS-based vegetation trends** with direct web integration capabilities.

## Agricultural and ecological datasets for phenology

**USA National Phenology Network provides the most comprehensive phenological data** for North American bloom monitoring through https://docs.google.com/document/d/1yNjupricKOAXn6tY1sI7-EwkcfwdGUZ7lxYv7fcPjO8/edit. **No API key requirements** with **honor system identification** enable immediate integration, while **Geoserver WMS services** provide real-time map integration.

### Phenology network APIs

**USA-NPN Observational Data API** delivers flowering observations with **JSON and CSV formats**:

```javascript
// USA-NPN phenology data query
const usanpnBase = 'https://www.usanpn.org/npn_portal/observations/getObservations.json';
const params = {
  start_date: '2023-01-01',
  end_date: '2023-12-31',
  species_id: [/* species IDs */],
  phenophase_id: [/* flowering phase IDs */],
  state_id: [/* state codes */]
};
```

**Pan European Phenology (PEP725)** provides **12+ million European observations** spanning **1868-present** through http://www.pep725.eu/ with **standardized BBCH growth stage classifications** and **unrestricted scientific access**.

### Global biodiversity and flowering data

**GBIF API** at https://techdocs.gbif.org/en/openapi/ offers **46+ million species occurrence records** with flowering annotations. **No authentication required** for basic queries, with **comprehensive REST API** supporting geographic and temporal filtering:

```javascript
// GBIF flowering observations
const gbifUrl = 'https://api.gbif.org/v1/occurrence/search';
const gbifParams = {
  hasCoordinate: true,
  hasGeospatialIssue: false,
  basisOfRecord: 'HUMAN_OBSERVATION',
  repatriated: false,
  q: 'flowering OR blooming OR flower',
  limit: 300
};
```

**iNaturalist research-grade observations** provide **real-time citizen science data** with **phenology annotations** (flowering, fruiting, budding states) shared automatically with GBIF for comprehensive coverage.

### Agricultural monitoring datasets

**USDA NASS Quick Stats API** delivers **comprehensive crop monitoring data** through https://quickstats.nass.usda.gov/api with **JSON format responses** and **county-level resolution**. **Cropland Data Layer (CDL)** provides **annual land use classifications** supporting agricultural bloom prediction.

**FAO GIEWS Agricultural Stress Index** offers **global crop monitoring** through **16,000+ data layers** with **1km resolution** and **WMS integration capabilities**:

```javascript
// FAO GIEWS WMS integration
const faoWmsUrl = 'https://data.apps.fao.org/geoserver/ows';
const faoParams = {
  SERVICE: 'WMS',
  REQUEST: 'GetMap',
  LAYERS: 'asis:dekad_VCI_current',
  FORMAT: 'image/png',
  TRANSPARENT: true,
  VERSION: '1.1.1'
};
```

## Documentation and implementation examples

**NASA GIBS web examples repository** at https://github.com/nasa-gibs/gibs-web-examples provides **production-ready implementations** for all major mapping libraries including **MapLibre GL and react-map-gl**. **Complete installation instructions** (`npm install && npm start`) enable immediate deployment at http://localhost:3001.

### React-specific implementation patterns

**NASA-IMPACT Earthdata Dashboard** demonstrates **comprehensive satellite data integration** through https://github.com/NASA-IMPACT/earthdata-dashboard-starter. **React-based architecture** with **time-series visualization** and **Cloud Optimized GeoTIFF processing** provides a complete implementation template.

**Key integration pattern for BloomWatch:**

```javascript
import React, { useState, useEffect } from 'react';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

function BloomWatchMap() {
  const [viewState, setViewState] = useState({
    longitude: -95.7129, latitude: 37.0902, zoom: 4
  });
  
  const handleMapLoad = (evt) => {
    const map = evt.target;
    
    // Add NASA GIBS vegetation layer
    map.addSource('ndvi-source', {
      type: 'raster',
      tiles: [
        'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_NDVI_8Day/default/{time}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png'
      ],
      tileSize: 256
    });
    
    map.addLayer({
      id: 'ndvi-layer',
      type: 'raster',
      source: 'ndvi-source',
      paint: { 'raster-opacity': 0.7 }
    });
  };

  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      style={{width: '100%', height: '600px'}}
      mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      onLoad={handleMapLoad}
    />
  );
}
```

### Advanced processing capabilities

**AppEEARS Python integration** through https://github.com/nasa/AppEEARS-Data-Resources enables **server-side processing** with **time series analysis** and **automated quality assessment**. **JavaScript client integration** supports real-time data visualization with **Bearer token authentication**.

**Vegetation index calculation examples** from https://github.com/rishabhdhenkawat/Vegetation-Index-With-Satellite-Data demonstrate **NDVI computation workflows** using **Planet Labs and Landsat data** with **rasterio and NumPy processing**.

## Conclusion

The comprehensive NASA Earth observation ecosystem provides unprecedented capabilities for global bloom monitoring through **standardized APIs, cloud-optimized data formats, and production-ready integration examples**. **MODIS and VIIRS vegetation products** offer the optimal combination of **temporal resolution, spatial coverage, and real-time capabilities** for bloom detection, while **GIBS web services** enable immediate visualization without authentication requirements.

**React-map-gl integration** benefits from **extensive documentation, working code examples, and free basemap services** that support rapid development. **Complementary datasets** from **phenology networks, agricultural monitoring systems, and citizen science platforms** provide validation data and regional context for comprehensive bloom tracking applications.

The **technical architecture** supports both **real-time monitoring through LANCE services** and **historical analysis through multi-decade archives**, enabling sophisticated bloom prediction models while maintaining **web application performance standards** through **tile-based services and cloud-optimized formats**.