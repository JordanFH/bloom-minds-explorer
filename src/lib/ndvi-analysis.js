/**
 * NDVI Historical Analysis Module
 * Analyzes historical NDVI data for prediction purposes
 */

/**
 * Fetch historical NDVI data for a location
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} yearsBack - Number of years to fetch (default 3-5)
 * @returns {Promise<Array>} Historical NDVI data points
 */
export async function fetchHistoricalNDVI(lat, lon, yearsBack = 3) {
  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - yearsBack);

  // Format dates for AppEEARS API (MM-DD-YYYY)
  const formatDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  // For now, generate mock historical data
  // In production, this would call AppEEARS API or Google Earth Engine
  const mockData = generateMockHistoricalData(lat, lon, yearsBack);

  return mockData;
}

/**
 * Generate mock historical NDVI data for testing
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} years - Number of years
 * @returns {Array} Mock NDVI time series
 */
function generateMockHistoricalData(lat, lon, years) {
  const data = [];
  const endDate = new Date();

  // Generate data points every 16 days (MODIS temporal resolution)
  for (let year = 0; year < years; year++) {
    for (let month = 0; month < 12; month++) {
      const date = new Date(endDate);
      date.setFullYear(date.getFullYear() - year);
      date.setMonth(month);

      // Seasonal pattern: higher NDVI in growing season
      const seasonalFactor = Math.sin((month / 12) * Math.PI * 2 - Math.PI / 2) * 0.2 + 0.5;

      // Add some randomness
      const noise = (Math.random() - 0.5) * 0.1;

      // Latitude effect: higher latitudes have lower NDVI in winter
      const latitudeFactor = Math.cos((Math.abs(lat) / 90) * Math.PI / 2) * 0.2;

      const ndvi = Math.max(0, Math.min(1, seasonalFactor + latitudeFactor + noise));

      data.push({
        date: date.toISOString().split("T")[0],
        ndvi: Number(ndvi.toFixed(3)),
        month: month + 1,
        year: date.getFullYear(),
      });
    }
  }

  return data.sort((a, b) => new Date(a.date) - new Date(b.date));
}

/**
 * Calculate seasonal pattern from historical data
 * Returns average NDVI for each month
 * @param {Array} historicalData - Historical NDVI data points
 * @returns {Object} Monthly averages and standard deviations
 */
export function calculateSeasonalPattern(historicalData) {
  const monthlyData = {};

  // Initialize monthly arrays
  for (let month = 1; month <= 12; month++) {
    monthlyData[month] = [];
  }

  // Group data by month
  historicalData.forEach((point) => {
    if (point.month && point.ndvi !== null && point.ndvi !== undefined) {
      monthlyData[point.month].push(point.ndvi);
    }
  });

  // Calculate statistics for each month
  const seasonalPattern = {};
  for (let month = 1; month <= 12; month++) {
    const values = monthlyData[month];

    if (values.length === 0) {
      seasonalPattern[month] = {
        average: 0,
        stdDev: 0,
        count: 0,
      };
      continue;
    }

    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    seasonalPattern[month] = {
      average: Number(average.toFixed(3)),
      stdDev: Number(stdDev.toFixed(3)),
      count: values.length,
      min: Number(Math.min(...values).toFixed(3)),
      max: Number(Math.max(...values).toFixed(3)),
    };
  }

  return seasonalPattern;
}

/**
 * Calculate long-term trend using linear regression
 * @param {Array} historicalData - Historical NDVI data points
 * @returns {Object} Trend slope and intercept
 */
export function calculateTrend(historicalData) {
  if (historicalData.length < 2) {
    return { slope: 0, intercept: 0, r2: 0 };
  }

  // Convert dates to numeric values (days since first observation)
  const firstDate = new Date(historicalData[0].date).getTime();
  const dataPoints = historicalData
    .filter((point) => point.ndvi !== null && point.ndvi !== undefined)
    .map((point) => ({
      x: (new Date(point.date).getTime() - firstDate) / (1000 * 60 * 60 * 24), // days
      y: point.ndvi,
    }));

  const n = dataPoints.length;
  if (n < 2) {
    return { slope: 0, intercept: 0, r2: 0 };
  }

  // Calculate means
  const xMean = dataPoints.reduce((sum, p) => sum + p.x, 0) / n;
  const yMean = dataPoints.reduce((sum, p) => sum + p.y, 0) / n;

  // Calculate slope and intercept
  let numerator = 0;
  let denominator = 0;
  let ssTotal = 0;
  let ssResidual = 0;

  for (const point of dataPoints) {
    numerator += (point.x - xMean) * (point.y - yMean);
    denominator += Math.pow(point.x - xMean, 2);
    ssTotal += Math.pow(point.y - yMean, 2);
  }

  const slope = denominator !== 0 ? numerator / denominator : 0;
  const intercept = yMean - slope * xMean;

  // Calculate R² (coefficient of determination)
  for (const point of dataPoints) {
    const predicted = slope * point.x + intercept;
    ssResidual += Math.pow(point.y - predicted, 2);
  }

  const r2 = ssTotal !== 0 ? 1 - ssResidual / ssTotal : 0;

  return {
    slope: Number(slope.toFixed(6)),
    intercept: Number(intercept.toFixed(3)),
    r2: Number(r2.toFixed(3)),
    slopePerYear: Number((slope * 365).toFixed(6)), // Slope per year
  };
}

/**
 * Calculate variability metrics from historical data
 * @param {Array} historicalData - Historical NDVI data points
 * @returns {Object} Variability statistics
 */
export function calculateVariability(historicalData) {
  const values = historicalData
    .filter((point) => point.ndvi !== null && point.ndvi !== undefined)
    .map((point) => point.ndvi);

  if (values.length === 0) {
    return {
      mean: 0,
      stdDev: 0,
      min: 0,
      max: 0,
      range: 0,
      cv: 0, // Coefficient of variation
    };
  }

  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  const cv = mean !== 0 ? stdDev / mean : 0; // Coefficient of variation

  return {
    mean: Number(mean.toFixed(3)),
    stdDev: Number(stdDev.toFixed(3)),
    min: Number(min.toFixed(3)),
    max: Number(max.toFixed(3)),
    range: Number(range.toFixed(3)),
    cv: Number(cv.toFixed(3)),
    count: values.length,
  };
}

/**
 * Complete historical analysis combining all metrics
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} yearsBack - Number of years to analyze
 * @returns {Promise<Object>} Complete analysis results
 */
export async function analyzeHistoricalNDVI(lat, lon, yearsBack = 3) {
  // Fetch historical data
  const historicalData = await fetchHistoricalNDVI(lat, lon, yearsBack);

  // Calculate all metrics
  const seasonalPattern = calculateSeasonalPattern(historicalData);
  const trend = calculateTrend(historicalData);
  const variability = calculateVariability(historicalData);

  return {
    location: { lat, lon },
    dataRange: {
      start: historicalData[0]?.date,
      end: historicalData[historicalData.length - 1]?.date,
      points: historicalData.length,
    },
    historicalData,
    seasonalPattern,
    trend,
    variability,
    analysisDate: new Date().toISOString(),
  };
}
