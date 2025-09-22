# NASA Space Apps Challenge 2025 BloomWatch: Guía Técnica Integral de Recursos

Los conjuntos de datos y APIs de observación terrestre de la NASA proporcionan capacidades sin precedentes para monitorear la vegetación global y eventos de floración. Esta guía integral presenta recursos técnicos específicos y accionables para construir una aplicación web que muestre eventos de floración de plantas utilizando react-map-gl con maplibre-gl, completa con URLs, endpoints de API y ejemplos de integración.

## Conjuntos de datos de observación terrestre de la NASA para monitoreo de vegetación

**Los índices de vegetación MODIS representan el estándar de oro** para el monitoreo de vegetación basado en web, ofreciendo más de 20 años de datos consistentes a través de múltiples métodos de acceso. El **producto MOD13Q1 entrega datos NDVI y EVI de resolución 250m** en composiciones de 16 días, accesibles vía servicios web GIBS sin autenticación. **Los productos VIIRS proporcionan capacidades casi en tiempo real** con actualizaciones dentro de 3-5 horas a través del sistema LANCE, crucial para la detección actual de eventos de floración.

### Productos de vegetación MODIS

**LP DAAC sirve como el portal principal** en https://lpdaac.usgs.gov/ con índices integrales de vegetación MODIS. Los productos **MOD13Q1 (250m, 16 días)** y **MOD13A1 (500m, 16 días)** ofrecen resolución espacial y temporal óptima para la detección de floración. **La integración con Google Earth Engine** proporciona acceso directo vía colecciones `MODIS/061/MOD13Q1` con APIs de JavaScript y Python.

**Los endpoints clave de API incluyen:**
- API CMR: https://cmr.earthdata.nasa.gov/search/
- GIBS WMTS: `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi`
- API AppEEARS: https://appeears.earthdatacloud.nasa.gov/api/

**Las especificaciones técnicas** soportan integración web con **formatos HDF4 y NetCDF4**, **composiciones temporales de 16 días**, y **derechos de redistribución gratuita**. La autenticación requiere NASA Earthdata Login para descargas de datos, mientras que los servicios de visualización GIBS operan sin autenticación.

### Monitoreo de vegetación en tiempo real VIIRS

**Los servicios VIIRS LANCE** proporcionan los datos de vegetación más actuales a través de https://www.earthdata.nasa.gov/data/instruments/viirs/land-near-real-time-data. **Los productos VNP13A1 entregan índices NDVI, EVI y EVI2 de resolución 500m** con composiciones de 16 días, mientras que **VNP13A4N proporciona actualizaciones casi en tiempo real de 8 días** dentro de 3-5 horas de la observación satelital.

**Los beneficios de integración incluyen:**
- Capacidades de detección de floración en tiempo real
- Consistente con productos MODIS para análisis histórico
- Compatible con servicios de mapeo web GIBS
- Formatos HDF5 y NetCDF4 optimizados para acceso en la nube

### Datos Listos para Análisis de Landsat

**USGS EarthExplorer y STAC API** en https://landsatlook.usgs.gov/stac-server proporcionan acceso integral a Landsat con **resolución espacial de 30m** y **ciclos de repetición de 16 días**. **El formato Cloud Optimized GeoTIFF (COG)** permite integración web eficiente, mientras que **la Interfaz Bajo Demanda ESPA** genera índices de vegetación personalizados.

**La integración con AppEEARS** soporta extracción de series temporales para ubicaciones específicas con procesamiento automatizado. **El acceso AWS S3** vía `s3://usgs-landsat` proporciona acceso directo basado en la nube para aplicaciones web.

### Conjuntos de datos espectrales avanzados

**La misión PACE entrega monitoreo de vegetación hiperespectral** a través del Ocean Biology DAAC en https://oceancolor.gsfc.nasa.gov/data/find-data/. **El Índice de Vegetación Mejorado (EVI) e índices especializados de pigmentos** soportan análisis detallado de floración con **cobertura global diaria** y **más de 100 bandas espectrales**.

**Los datos espectrales EMIT** accedidos a través de https://lpdaac.usgs.gov/data/get-started-data/collection-overview/missions/emit-overview/ proporcionan **imágenes hiperespectrales de 285 bandas** para análisis avanzado de estrés de vegetación. **El formato NetCDF4 y resolución de 60m** permiten estudios fenológicos detallados cuando se combinan con análisis temporal.

## Portales de datos de la NASA y APIs en tiempo real

**NASA GIBS representa el punto de entrada más accesible** para integración de mapeo web, proporcionando más de 1,000 productos de imágenes satelitales a través de servicios web estándar. **No hay requisitos de autenticación** para servicios de visualización que permiten implementación inmediata, mientras que **las actualizaciones sub-horarias** soportan aplicaciones de monitoreo en tiempo real.

### Servicios de mapeo web GIBS

**Endpoints WMTS completos** soportan integración directa con react-map-gl:

```javascript
// Ejemplo de integración MODIS NDVI
const gibsUrl = 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi';
const layer = 'MODIS_Terra_NDVI_8Day';
const tileUrl = `${gibsUrl}?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${layer}&STYLE=default&TILEMATRIXSET=GoogleMapsCompatible_Level9&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image/png&TIME=${date}`;

map.addSource('ndvi-tiles', {
  type: 'raster',
  tiles: [tileUrl],
  tileSize: 256
});
```

**Las capas de vegetación disponibles incluyen:**
- Composiciones NDVI MODIS Terra/Aqua de 8 y 16 días
- Índices de vegetación VIIRS con actualizaciones casi en tiempo real
- Productos de temperatura de superficie terrestre correlacionando con floración
- Campos Continuos de Vegetación para mapeo base

### Acceso programático AppEEARS

**La API AppEEARS** en https://appeears.earthdatacloud.nasa.gov/api/ permite extracción de series temporales para regiones específicas con productos integrales de vegetación. **El flujo de autenticación** usa NASA Earthdata Login con tokens Bearer:

```javascript
// Autenticación AppEEARS y solicitud de datos
const loginResponse = await fetch('https://appeears.earthdatacloud.nasa.gov/api/login', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: 'grant_type=client_credentials'
});

const { token } = await loginResponse.json();

// Enviar solicitud de series temporales de vegetación
const taskRequest = {
  task_name: 'BloomWatch_Analysis',
  task_type: 'area',
  params: {
    dates: [{ startDate: '01-01-2023', endDate: '12-31-2023' }],
    layers: [
      { product: 'MOD13Q1.061', layer: 'NDVI' },
      { product: 'VNP13A1.001', layer: 'EVI2' }
    ],
    coordinates: [/* polígono GeoJSON */]
  }
};
```

### Datos de ciencia ciudadana GLOBE Observer

**La API GLOBE** proporciona observaciones de floración de científicos ciudadanos a través de https://api.globe.gov/search/swagger-ui.html#/. **La salida en formato GeoJSON** se integra directamente con bibliotecas de mapeo web:

```javascript
// Consultar observaciones de floración
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

**No se requiere autenticación** para el acceso a datos GLOBE, con **límites de consulta de 1 millón de registros** asegurando rendimiento confiable para aplicaciones web.

## Recursos técnicos de integración de mapeo web

**La compatibilidad con react-map-gl requiere tiles vectoriales y headers CORS configurados apropiadamente** para integración perfecta. **Los servicios de mapa base gratuitos** de CartoCDN y EOX proporcionan cobertura global sin claves API, mientras que **NASA GIBS ofrece capacidades especializadas de superposición de vegetación**.

### Servicios de mapa base gratuitos para react-map-gl

**CartoCDN proporciona mapas base listos para producción** con soporte CORS completo:

```javascript
// Integración CartoCDN
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

**Las imágenes EOX Sentinel-2 sin nubes** proporcionan mapas base satelitales globales de alta resolución:

```javascript
// Mapa base satelital de alta resolución
map.addSource('sentinel2', {
  type: 'raster',
  tiles: ['https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg'],
  tileSize: 256
});
```

### Límites de vegetación global

**Natural Earth Data** en http://www.naturalearthdata.com/ proporciona **datos vectoriales de dominio público** en múltiples resoluciones (1:10m, 1:50m, 1:110m). **Límites administrativos y regiones agrícolas** soportan funcionalidad de selección de país/región.

**Áreas Administrativas Globales (GADM)** ofrece **subdivisiones detalladas de países** a través de https://www.gadm.org/ con **38,735 límites totales** a través de 5 niveles administrativos. **Licencia académica gratuita** y **soporte de múltiples formatos** (Shapefile, GeoJSON, GeoPackage) permiten integración flexible.

### Imágenes satelitales optimizadas para la nube

**NASA GIBS soporta consultas de dimensión temporal** permitiendo análisis histórico de floración:

```javascript
// Capa de vegetación habilitada para tiempo
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

**El acceso Cloud Optimized GeoTIFF (COG)** a través de OpenGeoHub proporciona **tendencias de vegetación basadas en MODIS de resolución 250m** con capacidades de integración web directa.

## Conjuntos de datos agrícolas y ecológicos para fenología

**La Red Nacional de Fenología de Estados Unidos proporciona los datos fenológicos más integrales** para monitoreo de floración de América del Norte a través de https://docs.google.com/document/d/1yNjupricKOAXn6tY1sI7-EwkcfwdGUZ7lxYv7fcPjO8/edit. **No hay requisitos de clave API** con **identificación del sistema de honor** que permiten integración inmediata, mientras que **los servicios Geoserver WMS** proporcionan integración de mapas en tiempo real.

### APIs de red de fenología

**La API de Datos Observacionales USA-NPN** entrega observaciones de floración con **formatos JSON y CSV**:

```javascript
// Consulta de datos de fenología USA-NPN
const usanpnBase = 'https://www.usanpn.org/npn_portal/observations/getObservations.json';
const params = {
  start_date: '2023-01-01',
  end_date: '2023-12-31',
  species_id: [/* IDs de especies */],
  phenophase_id: [/* IDs de fase de floración */],
  state_id: [/* códigos de estado */]
};
```

**Fenología Pan Europea (PEP725)** proporciona **más de 12 millones de observaciones europeas** abarcando **1868-presente** a través de http://www.pep725.eu/ con **clasificaciones estandarizadas de etapa de crecimiento BBCH** y **acceso científico sin restricciones**.

### Datos globales de biodiversidad y floración

**La API GBIF** en https://techdocs.gbif.org/en/openapi/ ofrece **más de 46 millones de registros de ocurrencia de especies** con anotaciones de floración. **No se requiere autenticación** para consultas básicas, con **API REST integral** que soporta filtrado geográfico y temporal:

```javascript
// Observaciones de floración GBIF
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

**Las observaciones de grado de investigación iNaturalist** proporcionan **datos de ciencia ciudadana en tiempo real** con **anotaciones de fenología** (estados de floración, fructificación, brote) compartidos automáticamente con GBIF para cobertura integral.

### Conjuntos de datos de monitoreo agrícola

**La API USDA NASS Quick Stats** entrega **datos integrales de monitoreo de cultivos** a través de https://quickstats.nass.usda.gov/api con **respuestas en formato JSON** y **resolución a nivel de condado**. **La Capa de Datos de Tierras de Cultivo (CDL)** proporciona **clasificaciones anuales de uso de suelo** que soportan predicción de floración agrícola.

**El Índice de Estrés Agrícola FAO GIEWS** ofrece **monitoreo global de cultivos** a través de **más de 16,000 capas de datos** con **resolución de 1km** y **capacidades de integración WMS**:

```javascript
// Integración WMS FAO GIEWS
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

## Documentación y ejemplos de implementación

**El repositorio de ejemplos web NASA GIBS** en https://github.com/nasa-gibs/gibs-web-examples proporciona **implementaciones listas para producción** para todas las principales bibliotecas de mapeo incluyendo **MapLibre GL y react-map-gl**. **Instrucciones completas de instalación** (`npm install && npm start`) permiten despliegue inmediato en http://localhost:3001.

### Patrones de implementación específicos para React

**El Panel de Control Earthdata de NASA-IMPACT** demuestra **integración integral de datos satelitales** a través de https://github.com/NASA-IMPACT/earthdata-dashboard-starter. **Arquitectura basada en React** con **visualización de series temporales** y **procesamiento Cloud Optimized GeoTIFF** proporciona una plantilla de implementación completa.

**Patrón de integración clave para BloomWatch:**

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
    
    // Agregar capa de vegetación NASA GIBS
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

### Capacidades de procesamiento avanzado

**La integración Python AppEEARS** a través de https://github.com/nasa/AppEEARS-Data-Resources permite **procesamiento del lado del servidor** con **análisis de series temporales** y **evaluación automatizada de calidad**. **La integración cliente JavaScript** soporta visualización de datos en tiempo real con **autenticación de token Bearer**.

**Ejemplos de cálculo de índices de vegetación** de https://github.com/rishabhdhenkawat/Vegetation-Index-With-Satellite-Data demuestran **flujos de trabajo de cálculo NDVI** usando **datos de Planet Labs y Landsat** con **procesamiento rasterio y NumPy**.

## Conclusión

El ecosistema integral de observación terrestre de la NASA proporciona capacidades sin precedentes para monitoreo global de floración a través de **APIs estandarizadas, formatos de datos optimizados para la nube, y ejemplos de integración listos para producción**. **Los productos de vegetación MODIS y VIIRS** ofrecen la combinación óptima de **resolución temporal, cobertura espacial, y capacidades en tiempo real** para detección de floración, mientras que **los servicios web GIBS** permiten visualización inmediata sin requisitos de autenticación.

**La integración react-map-gl** se beneficia de **documentación extensa, ejemplos de código funcionando, y servicios de mapa base gratuitos** que soportan desarrollo rápido. **Los conjuntos de datos complementarios** de **redes de fenología, sistemas de monitoreo agrícola, y plataformas de ciencia ciudadana** proporcionan datos de validación y contexto regional para aplicaciones integrales de seguimiento de floración.

**La arquitectura técnica** soporta tanto **monitoreo en tiempo real a través de servicios LANCE** como **análisis histórico a través de archivos multi-década**, permitiendo modelos sofisticados de predicción de floración mientras mantiene **estándares de rendimiento de aplicaciones web** a través de **servicios basados en tiles y formatos optimizados para la nube**.