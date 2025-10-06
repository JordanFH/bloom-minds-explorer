/**
 * NDVI Prediction Module
 * Predicts future NDVI values using statistical analysis
 */

import {
  analyzeHistoricalNDVI,
  calculateSeasonalPattern,
  calculateTrend,
  calculateVariability,
} from "./ndvi-analysis.js";

/**
 * Predict NDVI value for a future date
 * Formula: NDVI_predicted = Seasonal_average + Trend_adjustment + Variability_factor
 *
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {Date|string} targetDate - Future date to predict
 * @param {number} yearsHistory - Years of historical data to use (default 3)
 * @returns {Promise<Object>} Prediction results with confidence
 */
export async function predictNDVI(lat, lon, targetDate, yearsHistory = 3) {
  // Validate target date is in the future
  const target = new Date(targetDate);
  const now = new Date();

  if (target <= now) {
    throw new Error("Target date must be in the future");
  }

  // Check if prediction is within valid range (max 90 days)
  const daysAhead = Math.floor((target - now) / (1000 * 60 * 60 * 24));
  if (daysAhead > 90) {
    throw new Error("Predictions are only available up to 90 days in advance");
  }

  // Get historical analysis
  const analysis = await analyzeHistoricalNDVI(lat, lon, yearsHistory);

  // Extract month from target date
  const targetMonth = target.getMonth() + 1;

  // Get seasonal baseline for target month
  const seasonalBaseline = analysis.seasonalPattern[targetMonth]?.average || 0;
  const seasonalStdDev = analysis.seasonalPattern[targetMonth]?.stdDev || 0;

  // Calculate trend adjustment
  // Days from start of historical data to target date
  const firstDate = new Date(analysis.dataRange.start);
  const daysFromStart = (target - firstDate) / (1000 * 60 * 60 * 24);
  const trendAdjustment = analysis.trend.slope * daysFromStart;

  // Calculate variability factor (weighted by distance)
  // Predictions further in the future are less certain
  const uncertaintyFactor = Math.min(daysAhead / 90, 1); // 0 to 1
  const variabilityAdjustment = analysis.variability.stdDev * uncertaintyFactor * 0.5;

  // Final prediction
  let predictedNDVI = seasonalBaseline + trendAdjustment;

  // Ensure NDVI stays within valid range [0, 1]
  predictedNDVI = Math.max(0, Math.min(1, predictedNDVI));

  // Calculate prediction range (min/max bounds)
  const lowerBound = Math.max(0, predictedNDVI - variabilityAdjustment);
  const upperBound = Math.min(1, predictedNDVI + variabilityAdjustment);

  // Calculate confidence percentage
  const confidence = calculateConfidence(
    analysis,
    targetMonth,
    daysAhead,
    uncertaintyFactor,
  );

  return {
    prediction: {
      ndvi: Number(predictedNDVI.toFixed(3)),
      lowerBound: Number(lowerBound.toFixed(3)),
      upperBound: Number(upperBound.toFixed(3)),
      targetDate: target.toISOString().split("T")[0],
      daysAhead,
    },
    confidence: {
      percentage: confidence,
      level: getConfidenceLevel(confidence),
      factors: {
        seasonalStability: Number((1 - seasonalStdDev / (seasonalBaseline + 0.1)).toFixed(3)),
        trendReliability: analysis.trend.r2,
        dataQuality: Math.min(analysis.dataRange.points / (yearsHistory * 24), 1),
        temporalDistance: Number((1 - uncertaintyFactor).toFixed(3)),
      },
    },
    analysis: {
      seasonalBaseline,
      trendAdjustment: Number(trendAdjustment.toFixed(4)),
      historicalMean: analysis.variability.mean,
      historicalRange: {
        min: analysis.variability.min,
        max: analysis.variability.max,
      },
    },
    metadata: {
      location: { lat, lon },
      yearsAnalyzed: yearsHistory,
      dataPoints: analysis.dataRange.points,
      predictionDate: new Date().toISOString(),
    },
  };
}

/**
 * Calculate prediction confidence percentage
 * @param {Object} analysis - Historical analysis results
 * @param {number} targetMonth - Target month (1-12)
 * @param {number} daysAhead - Days into the future
 * @param {number} uncertaintyFactor - Uncertainty factor (0-1)
 * @returns {number} Confidence percentage (0-100)
 */
export function calculateConfidence(analysis, targetMonth, daysAhead, uncertaintyFactor) {
  // Factor 1: Seasonal stability (how consistent is this month historically)
  const seasonalData = analysis.seasonalPattern[targetMonth];
  const seasonalStability =
    seasonalData && seasonalData.average > 0
      ? 1 - seasonalData.stdDev / (seasonalData.average + 0.1)
      : 0.5;

  // Factor 2: Trend reliability (R² from linear regression)
  const trendReliability = analysis.trend.r2;

  // Factor 3: Data quality (amount of historical data)
  const expectedPoints = analysis.dataRange.points;
  const dataQuality = Math.min(expectedPoints / 36, 1); // 36 = 3 years * 12 months

  // Factor 4: Temporal distance (closer predictions are more reliable)
  const temporalReliability = 1 - uncertaintyFactor;

  // Factor 5: Overall variability (lower CV = higher confidence)
  const variabilityScore = Math.max(0, 1 - analysis.variability.cv);

  // Weighted average of all factors
  const weights = {
    seasonal: 0.3,
    trend: 0.2,
    data: 0.2,
    temporal: 0.2,
    variability: 0.1,
  };

  const confidence =
    seasonalStability * weights.seasonal +
    trendReliability * weights.trend +
    dataQuality * weights.data +
    temporalReliability * weights.temporal +
    variabilityScore * weights.variability;

  // Convert to percentage and ensure it's in valid range
  return Math.round(Math.max(0, Math.min(100, confidence * 100)));
}

/**
 * Get confidence level description
 * @param {number} percentage - Confidence percentage
 * @returns {string} Confidence level
 */
export function getConfidenceLevel(percentage) {
  if (percentage >= 80) return "high";
  if (percentage >= 60) return "medium";
  if (percentage >= 40) return "low";
  return "very_low";
}

/**
 * Predict NDVI for multiple future dates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {Array<Date|string>} dates - Array of future dates
 * @param {number} yearsHistory - Years of historical data
 * @returns {Promise<Array>} Array of predictions
 */
export async function predictMultipleDates(lat, lon, dates, yearsHistory = 3) {
  const predictions = [];

  for (const date of dates) {
    try {
      const prediction = await predictNDVI(lat, lon, date, yearsHistory);
      predictions.push(prediction);
    } catch (error) {
      predictions.push({
        targetDate: new Date(date).toISOString().split("T")[0],
        error: error.message,
      });
    }
  }

  return predictions;
}

/**
 * Generate forecast for next N days
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} days - Number of days to forecast (max 90)
 * @param {number} interval - Interval between predictions in days (default 7)
 * @param {number} yearsHistory - Years of historical data
 * @returns {Promise<Object>} Forecast results
 */
export async function generateForecast(lat, lon, days = 30, interval = 7, yearsHistory = 3) {
  if (days > 90) {
    throw new Error("Maximum forecast period is 90 days");
  }

  const dates = [];
  const now = new Date();

  for (let i = interval; i <= days; i += interval) {
    const forecastDate = new Date(now);
    forecastDate.setDate(forecastDate.getDate() + i);
    dates.push(forecastDate);
  }

  const predictions = await predictMultipleDates(lat, lon, dates, yearsHistory);

  // Calculate forecast summary
  const validPredictions = predictions.filter((p) => !p.error);
  const avgConfidence =
    validPredictions.length > 0
      ? validPredictions.reduce((sum, p) => sum + p.confidence.percentage, 0) /
        validPredictions.length
      : 0;

  const avgNDVI =
    validPredictions.length > 0
      ? validPredictions.reduce((sum, p) => sum + p.prediction.ndvi, 0) /
        validPredictions.length
      : 0;

  return {
    location: { lat, lon },
    forecastPeriod: {
      days,
      interval,
      startDate: now.toISOString().split("T")[0],
      endDate: dates[dates.length - 1]?.toISOString().split("T")[0],
    },
    predictions,
    summary: {
      averageNDVI: Number(avgNDVI.toFixed(3)),
      averageConfidence: Math.round(avgConfidence),
      totalPredictions: predictions.length,
      validPredictions: validPredictions.length,
    },
    generatedAt: new Date().toISOString(),
  };
}
