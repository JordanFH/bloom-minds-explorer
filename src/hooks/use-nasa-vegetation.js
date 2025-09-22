/**
 * React hooks for NASA vegetation data integration
 * Provides real-time vegetation indices and bloom analysis
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createGibsTileUrl,
  GIBS_CONFIG,
  getBloomAnalysisRegions,
  getGibsDate,
  getVegetationLayers,
  isBloomSeason,
} from "@/lib/nasa-api";

/**
 * Hook for managing GIBS vegetation layers
 * @param {Object} options Configuration options
 * @returns {Object} Vegetation layer data and controls
 */
export function useVegetationLayers(options = {}) {
  const {
    defaultLayer = "truecolor",
    daysOffset = 0,
    autoUpdate = false,
    updateInterval = 3600000, // 1 hour
  } = options;

  const [currentLayer, setCurrentLayer] = useState(defaultLayer);
  const [currentDate, setCurrentDate] = useState(() => getGibsDate(daysOffset));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Available vegetation layers
  const availableLayers = useMemo(() => getVegetationLayers(), []);

  // Current layer configuration
  const activeLayer = useMemo(() => {
    return availableLayers.find((layer) => layer.id === currentLayer);
  }, [availableLayers, currentLayer]);

  // Generate tile URL for current configuration
  const tileUrl = useMemo(() => {
    if (!activeLayer) return null;

    try {
      // Use the correct layer name and date format
      const layerName = activeLayer.layer;
      const dateStr = activeLayer.requiresDate ? currentDate : null;

      if (dateStr) {
        return createGibsTileUrl(layerName, dateStr);
      } else {
        // For layers that don't require date
        return `${GIBS_CONFIG.baseUrl}?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${layerName}&STYLE=default&TILEMATRIXSET=GoogleMapsCompatible_Level9&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image/png`;
      }
    } catch (err) {
      setError(`Failed to create tile URL: ${err.message}`);
      return null;
    }
  }, [activeLayer, currentDate]);

  // MapLibre source configuration
  const mapSource = useMemo(() => {
    if (!tileUrl) return null;

    return {
      type: "raster",
      tiles: [tileUrl],
      tileSize: 256,
      attribution: "© NASA GIBS",
    };
  }, [tileUrl]);

  // Layer style configuration
  const layerStyle = useMemo(
    () => ({
      id: `nasa-${currentLayer}`,
      type: "raster",
      paint: {
        "raster-opacity": 0.7,
        "raster-fade-duration": 300,
      },
    }),
    [currentLayer],
  );

  // Change active layer
  const changeLayer = useCallback(
    (layerId) => {
      const layer = availableLayers.find((l) => l.id === layerId);
      if (layer) {
        setIsLoading(true);
        setError(null);
        setCurrentLayer(layerId);

        // Simulate loading delay for UX
        setTimeout(() => setIsLoading(false), 500);
      }
    },
    [availableLayers],
  );

  // Change date
  const changeDate = useCallback((date) => {
    setIsLoading(true);
    setError(null);
    setCurrentDate(date);
    setTimeout(() => setIsLoading(false), 300);
  }, []);

  // Navigate to relative date
  const navigateDate = useCallback(
    (daysOffset) => {
      const newDate = getGibsDate(daysOffset);
      changeDate(newDate);
    },
    [changeDate],
  );

  // Auto-update functionality
  useEffect(() => {
    if (!autoUpdate) return;

    const interval = setInterval(() => {
      const newDate = getGibsDate(daysOffset);
      if (newDate !== currentDate) {
        setCurrentDate(newDate);
      }
    }, updateInterval);

    return () => clearInterval(interval);
  }, [autoUpdate, updateInterval, daysOffset, currentDate]);

  return {
    // Current state
    currentLayer,
    currentDate,
    activeLayer,
    isLoading,
    error,

    // Layer data
    availableLayers,
    tileUrl,
    mapSource,
    layerStyle,

    // Controls
    changeLayer,
    changeDate,
    navigateDate,

    // Utilities
    getLatestDate: () => getGibsDate(0),
    getPreviousWeek: () => getGibsDate(-7),
    getPreviousMonth: () => getGibsDate(-30),
  };
}

/**
 * Hook for bloom analysis regions
 * @returns {Object} Bloom regions data and analysis
 */
export function useBloomRegions() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [analysisData, setAnalysisData] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Get all bloom regions
  const regions = useMemo(() => getBloomAnalysisRegions(), []);

  // Add bloom season status to regions
  const regionsWithStatus = useMemo(() => {
    return regions.map((region) => ({
      ...region,
      isInBloomSeason: isBloomSeason(region.peakBloomMonth),
      bloomStatus: isBloomSeason(region.peakBloomMonth) ? "active" : "dormant",
    }));
  }, [regions]);

  // Currently blooming regions
  const bloomingRegions = useMemo(() => {
    return regionsWithStatus.filter((region) => region.isInBloomSeason);
  }, [regionsWithStatus]);

  // Select region for analysis
  const selectRegion = useCallback(
    (regionName) => {
      const region = regionsWithStatus.find((r) => r.name === regionName);
      setSelectedRegion(region);
    },
    [regionsWithStatus],
  );

  // Simulate vegetation analysis for a region
  const analyzeRegion = useCallback(async (region) => {
    setIsAnalyzing(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate mock analysis data
      const mockData = {
        regionName: region.name,
        analysisDate: new Date().toISOString(),
        vegetationIndex: {
          ndvi: Math.random() * 0.4 + 0.4, // 0.4-0.8 range
          evi: Math.random() * 0.3 + 0.3, // 0.3-0.6 range
        },
        bloomProbability: region.isInBloomSeason
          ? Math.random() * 0.4 + 0.6
          : Math.random() * 0.3,
        temperatureC: Math.random() * 10 + 15, // 15-25°C
        trend: ["increasing", "stable", "decreasing"][
          Math.floor(Math.random() * 3)
        ],
      };

      setAnalysisData((prev) => ({
        ...prev,
        [region.name]: mockData,
      }));
    } catch (error) {
      console.error("Region analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    regions: regionsWithStatus,
    bloomingRegions,
    selectedRegion,
    analysisData,
    isAnalyzing,
    selectRegion,
    analyzeRegion,
  };
}

/**
 * Hook for real-time vegetation monitoring
 * @param {Object} coordinates Location to monitor
 * @returns {Object} Real-time vegetation data
 */
export function useVegetationMonitoring(coordinates) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Fetch vegetation data for coordinates
  const fetchVegetationData = useCallback(async () => {
    if (!coordinates) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulate NASA API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockData = {
        coordinates,
        timestamp: new Date().toISOString(),
        ndvi: Math.random() * 0.6 + 0.2,
        evi: Math.random() * 0.4 + 0.2,
        landSurfaceTemp: Math.random() * 15 + 10,
        vegetationHealth: ["poor", "fair", "good", "excellent"][
          Math.floor(Math.random() * 4)
        ],
        bloomLikelihood: Math.random(),
      };

      setData(mockData);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [coordinates]);

  // Auto-fetch on coordinates change
  useEffect(() => {
    if (coordinates) {
      fetchVegetationData();
    }
  }, [coordinates, fetchVegetationData]);

  return {
    data,
    isLoading,
    error,
    lastUpdate,
    refresh: fetchVegetationData,
  };
}

/**
 * Hook for time series vegetation analysis
 * @param {Object} region Region configuration
 * @param {Object} dateRange Start and end dates
 * @returns {Object} Time series data and controls
 */
export function useVegetationTimeSeries(region, dateRange) {
  const [timeSeries, setTimeSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTimeSeries = useCallback(async () => {
    if (!region || !dateRange) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulate time series data generation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

      const mockTimeSeries = Array.from({ length: daysDiff }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);

        return {
          date: date.toISOString().split("T")[0],
          ndvi: Math.random() * 0.4 + 0.3 + Math.sin(i / 30) * 0.1,
          evi: Math.random() * 0.3 + 0.2 + Math.sin(i / 30) * 0.05,
          temperature:
            Math.random() * 10 + 15 + Math.sin((i / 365) * 2 * Math.PI) * 5,
        };
      });

      setTimeSeries(mockTimeSeries);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [region, dateRange]);

  useEffect(() => {
    fetchTimeSeries();
  }, [fetchTimeSeries]);

  return {
    timeSeries,
    isLoading,
    error,
    refresh: fetchTimeSeries,
  };
}
