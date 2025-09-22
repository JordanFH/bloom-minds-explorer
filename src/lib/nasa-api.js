/**
 * NASA APIs integration utilities for BloomWatch
 * Handles GIBS, AppEEARS, and CMR API integrations
 */

// NASA GIBS Configuration
export const GIBS_CONFIG = {
  baseUrl: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi",
  layers: {
    MODIS_NDVI_8Day: "MODIS_Terra_NDVI_8Day",
    MODIS_EVI_8Day: "MODIS_Terra_EVI_8Day",
    VIIRS_NDVI: "VIIRS_SNPP_DayNightBand_ENCC",
    MODIS_LST_Day: "MODIS_Terra_Land_Surface_Temp_Day",
    MODIS_VCF: "MODIS_Terra_Vegetation_Continuous_Fields",
  },
  tileMatrixSet: "GoogleMapsCompatible_Level9",
  format: "image/png",
};

// AppEEARS Configuration
export const APPEEARS_CONFIG = {
  baseUrl: "https://appeears.earthdatacloud.nasa.gov/api",
  products: {
    MOD13Q1: "MOD13Q1.061", // MODIS Terra Vegetation Indices 16-Day 250m
    VNP13A1: "VNP13A1.001", // VIIRS Vegetation Indices 16-Day 500m
    MOD11A2: "MOD11A2.061", // MODIS Terra Land Surface Temperature
  },
};

/**
 * Generate GIBS tile URL for vegetation layers
 * @param {string} layer - Layer identifier from GIBS_CONFIG.layers
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {Object} options - Additional options
 * @returns {string} WMTS tile URL template
 */
export function createGibsTileUrl(layer, date, options = {}) {
  const {
    tileMatrixSet = GIBS_CONFIG.tileMatrixSet,
    format = GIBS_CONFIG.format,
    style = "default",
  } = options;

  // Build URL manually to avoid encoding the placeholders
  const baseParams = `SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${layer}&STYLE=${style}&TILEMATRIXSET=${tileMatrixSet}&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=${encodeURIComponent(format)}&TIME=${date}`;

  return `${GIBS_CONFIG.baseUrl}?${baseParams}`;
}

/**
 * Get current date in GIBS-compatible format
 * @param {number} daysOffset - Days to offset from today (negative for past)
 * @returns {string} Date in YYYY-MM-DD format
 */
export function getGibsDate(daysOffset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);

  // For MODIS 8-day products, we need to use actual available dates
  // Use a recent date that's likely to have data (offset to account for processing delay)
  const dataDate = new Date();
  dataDate.setDate(dataDate.getDate() - 7); // 7 days back to ensure data availability

  return dataDate.toISOString().split("T")[0];
}

/**
 * NASA Earthdata authentication
 * Note: For production, store credentials securely
 */
export class NasaAuth {
  constructor() {
    this.token = null;
    this.tokenExpiry = null;
  }

  async authenticate(username, password) {
    try {
      const response = await fetch(`${APPEEARS_CONFIG.baseUrl}/login`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`);
      }

      const data = await response.json();
      this.token = data.token;
      this.tokenExpiry = Date.now() + data.expires_in * 1000;

      return this.token;
    } catch (error) {
      console.error("NASA authentication error:", error);
      throw error;
    }
  }

  isTokenValid() {
    return this.token && this.tokenExpiry && Date.now() < this.tokenExpiry;
  }

  getAuthHeaders() {
    if (!this.isTokenValid()) {
      throw new Error("No valid token available");
    }
    return {
      Authorization: `Bearer ${this.token}`,
    };
  }
}

/**
 * AppEEARS API client for time series data
 */
export class AppEEARSClient {
  constructor(auth) {
    this.auth = auth;
    this.baseUrl = APPEEARS_CONFIG.baseUrl;
  }

  /**
   * Submit a vegetation analysis task
   * @param {Object} params - Task parameters
   * @returns {Promise<Object>} Task response
   */
  async submitTask(params) {
    const {
      taskName,
      coordinates, // GeoJSON polygon or point
      startDate,
      endDate,
      layers = ["NDVI", "EVI"],
    } = params;

    const taskData = {
      task_name: taskName,
      task_type: coordinates.type === "Point" ? "point" : "area",
      params: {
        dates: [
          {
            startDate: startDate,
            endDate: endDate,
          },
        ],
        layers: layers.map((layer) => ({
          product: APPEEARS_CONFIG.products.MOD13Q1,
          layer: layer,
        })),
        coordinates: coordinates,
      },
    };

    try {
      const response = await fetch(`${this.baseUrl}/task`, {
        method: "POST",
        headers: {
          ...this.auth.getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error(`Task submission failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("AppEEARS task submission error:", error);
      throw error;
    }
  }

  /**
   * Get task status
   * @param {string} taskId - Task identifier
   * @returns {Promise<Object>} Task status
   */
  async getTaskStatus(taskId) {
    try {
      const response = await fetch(`${this.baseUrl}/task/${taskId}`, {
        headers: this.auth.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Task status check failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("AppEEARS task status error:", error);
      throw error;
    }
  }

  /**
   * Download task results
   * @param {string} taskId - Task identifier
   * @returns {Promise<Object>} Task results
   */
  async downloadResults(taskId) {
    try {
      const response = await fetch(`${this.baseUrl}/bundle/${taskId}`, {
        headers: this.auth.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Results download failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("AppEEARS results download error:", error);
      throw error;
    }
  }
}

/**
 * Get available GIBS layers for vegetation monitoring
 * @returns {Array} Array of layer configurations
 */
export function getVegetationLayers() {
  return [
    {
      id: "truecolor",
      name: "True Color Satellite",
      layer: "MODIS_Aqua_CorrectedReflectance_TrueColor",
      description: "Natural color satellite imagery",
      requiresDate: true,
    },
    {
      id: "falsecolor",
      name: "False Color (Vegetation)",
      layer: "MODIS_Aqua_CorrectedReflectance_Bands721",
      description: "False color highlighting vegetation in red",
      requiresDate: true,
    },
    {
      id: "terra_truecolor",
      name: "Terra True Color",
      layer: "MODIS_Terra_CorrectedReflectance_TrueColor",
      description: "Terra satellite true color imagery",
      requiresDate: true,
    },
    {
      id: "terra_falsecolor",
      name: "Terra False Color",
      layer: "MODIS_Terra_CorrectedReflectance_Bands721",
      description: "Terra false color for vegetation analysis",
      requiresDate: true,
    },
  ];
}

/**
 * Create bloom analysis regions (sample locations for NASA Space Apps)
 * @returns {Array} Array of analysis regions
 */
export function getBloomAnalysisRegions() {
  return [
    {
      name: "Cherry Blossoms - Washington DC",
      coordinates: {
        type: "Point",
        coordinates: [-77.0365, 38.8977],
      },
      species: "Prunus serrulata",
      peakBloomMonth: 4,
      description: "Famous cherry blossoms around the Tidal Basin",
    },
    {
      name: "Jacaranda Trees - Los Angeles",
      coordinates: {
        type: "Point",
        coordinates: [-118.2437, 34.0522],
      },
      species: "Jacaranda mimosifolia",
      peakBloomMonth: 5,
      description: "Purple flowering trees throughout the city",
    },
    {
      name: "Sakura - Tokyo",
      coordinates: {
        type: "Point",
        coordinates: [139.6503, 35.6762],
      },
      species: "Prunus speciosa",
      peakBloomMonth: 4,
      description: "Traditional Japanese cherry blossoms",
    },
    {
      name: "Wildflower Superbloom - California",
      coordinates: {
        type: "Polygon",
        coordinates: [
          [
            [-116.8, 33.9],
            [-116.5, 33.9],
            [-116.5, 34.2],
            [-116.8, 34.2],
            [-116.8, 33.9],
          ],
        ],
      },
      species: "Mixed wildflowers",
      peakBloomMonth: 3,
      description: "Desert wildflower blooms in Antelope Valley",
    },
  ];
}

/**
 * Utility function to check if current date is within bloom season
 * @param {number} peakMonth - Peak bloom month (1-12)
 * @param {number} windowWeeks - Bloom window in weeks around peak
 * @returns {boolean} True if currently in bloom season
 */
export function isBloomSeason(peakMonth, windowWeeks = 4) {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const weekOffset = windowWeeks / 4.33; // Convert weeks to months approximation

  const startMonth = peakMonth - weekOffset;
  const endMonth = peakMonth + weekOffset;

  return currentMonth >= startMonth && currentMonth <= endMonth;
}
