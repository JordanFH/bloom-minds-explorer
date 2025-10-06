/**
 * Agronomic Recommendations Module
 * Provides actionable recommendations based on NDVI predictions
 */

/**
 * NDVI interpretation thresholds
 */
const NDVI_THRESHOLDS = {
  BARE_SOIL: 0.1,
  SPARSE_VEGETATION: 0.3,
  MODERATE_VEGETATION: 0.5,
  HEALTHY_VEGETATION: 0.7,
  VERY_HEALTHY: 0.8,
};

/**
 * Generate agronomic recommendations based on NDVI prediction
 * @param {Object} prediction - NDVI prediction result
 * @param {Object} options - Additional context options
 * @returns {Object} Recommendations object
 */
export function generateRecommendations(prediction, options = {}) {
  const { ndvi, targetDate, daysAhead } = prediction.prediction;
  const { percentage: confidence, level: confidenceLevel } = prediction.confidence;
  const { cropType = "general", currentNDVI = null, region = null } = options;

  const recommendations = {
    summary: getNDVISummary(ndvi),
    vegetation: {
      status: getVegetationStatus(ndvi),
      health: getHealthDescription(ndvi),
      trend: getTrendAnalysis(prediction.analysis),
    },
    actions: [],
    alerts: [],
    irrigation: getIrrigationRecommendation(ndvi, prediction),
    fertilization: getFertilizationRecommendation(ndvi, prediction),
    monitoring: getMonitoringRecommendation(confidenceLevel, daysAhead),
    timing: getTimingRecommendations(ndvi, targetDate, cropType),
  };

  // Add general actions based on NDVI level
  recommendations.actions = getActionItems(ndvi, prediction, currentNDVI);

  // Add alerts for concerning conditions
  recommendations.alerts = generateAlerts(ndvi, prediction, currentNDVI);

  // Add crop-specific recommendations if crop type provided
  if (cropType !== "general") {
    recommendations.cropSpecific = getCropSpecificRecommendations(
      cropType,
      ndvi,
      prediction,
    );
  }

  return recommendations;
}

/**
 * Get NDVI summary description
 * @param {number} ndvi - Predicted NDVI value
 * @returns {string} Summary text
 */
function getNDVISummary(ndvi) {
  if (ndvi < NDVI_THRESHOLDS.BARE_SOIL) {
    return "Bare soil or no vegetation detected";
  }
  if (ndvi < NDVI_THRESHOLDS.SPARSE_VEGETATION) {
    return "Sparse vegetation with low photosynthetic activity";
  }
  if (ndvi < NDVI_THRESHOLDS.MODERATE_VEGETATION) {
    return "Moderate vegetation cover with developing canopy";
  }
  if (ndvi < NDVI_THRESHOLDS.HEALTHY_VEGETATION) {
    return "Healthy vegetation with good canopy development";
  }
  if (ndvi < NDVI_THRESHOLDS.VERY_HEALTHY) {
    return "Very healthy vegetation with dense canopy";
  }
  return "Exceptionally dense and healthy vegetation";
}

/**
 * Get vegetation status category
 * @param {number} ndvi - NDVI value
 * @returns {string} Status category
 */
function getVegetationStatus(ndvi) {
  if (ndvi < NDVI_THRESHOLDS.BARE_SOIL) return "bare";
  if (ndvi < NDVI_THRESHOLDS.SPARSE_VEGETATION) return "sparse";
  if (ndvi < NDVI_THRESHOLDS.MODERATE_VEGETATION) return "moderate";
  if (ndvi < NDVI_THRESHOLDS.HEALTHY_VEGETATION) return "healthy";
  return "very_healthy";
}

/**
 * Get health description
 * @param {number} ndvi - NDVI value
 * @returns {string} Health level
 */
function getHealthDescription(ndvi) {
  if (ndvi < NDVI_THRESHOLDS.BARE_SOIL) return "No vegetation";
  if (ndvi < NDVI_THRESHOLDS.SPARSE_VEGETATION) return "Stressed or early growth";
  if (ndvi < NDVI_THRESHOLDS.MODERATE_VEGETATION) return "Developing";
  if (ndvi < NDVI_THRESHOLDS.HEALTHY_VEGETATION) return "Good";
  if (ndvi < NDVI_THRESHOLDS.VERY_HEALTHY) return "Excellent";
  return "Optimal";
}

/**
 * Analyze trend from historical data
 * @param {Object} analysis - Historical analysis data
 * @returns {Object} Trend information
 */
function getTrendAnalysis(analysis) {
  const { trendAdjustment } = analysis;
  const direction = trendAdjustment > 0.01 ? "improving" : trendAdjustment < -0.01 ? "declining" : "stable";

  return {
    direction,
    magnitude: Math.abs(trendAdjustment),
    description:
      direction === "improving"
        ? "Vegetation health is improving over time"
        : direction === "declining"
          ? "Vegetation health is declining - intervention may be needed"
          : "Vegetation health is stable",
  };
}

/**
 * Get irrigation recommendations
 * @param {number} ndvi - Predicted NDVI
 * @param {Object} prediction - Full prediction object
 * @returns {Object} Irrigation recommendation
 */
function getIrrigationRecommendation(ndvi, prediction) {
  if (ndvi < NDVI_THRESHOLDS.SPARSE_VEGETATION) {
    return {
      priority: "high",
      action: "Increase irrigation immediately",
      reason: "Low NDVI indicates water stress or insufficient vegetation",
      frequency: "Daily monitoring recommended",
    };
  }

  if (ndvi < NDVI_THRESHOLDS.MODERATE_VEGETATION) {
    return {
      priority: "medium",
      action: "Maintain regular irrigation schedule",
      reason: "Moderate vegetation requires consistent water supply",
      frequency: "Every 2-3 days depending on weather",
    };
  }

  if (ndvi < NDVI_THRESHOLDS.HEALTHY_VEGETATION) {
    return {
      priority: "low",
      action: "Continue current irrigation practices",
      reason: "Healthy vegetation with adequate water",
      frequency: "As needed based on soil moisture",
    };
  }

  return {
    priority: "low",
    action: "Reduce irrigation if possible",
    reason: "Very healthy vegetation may indicate excess water",
    frequency: "Monitor for signs of overwatering",
  };
}

/**
 * Get fertilization recommendations
 * @param {number} ndvi - Predicted NDVI
 * @param {Object} prediction - Full prediction object
 * @returns {Object} Fertilization recommendation
 */
function getFertilizationRecommendation(ndvi, prediction) {
  const trend = getTrendAnalysis(prediction.analysis);

  if (ndvi < NDVI_THRESHOLDS.SPARSE_VEGETATION || trend.direction === "declining") {
    return {
      priority: "high",
      action: "Apply nitrogen-rich fertilizer",
      reason: "Low NDVI or declining trend indicates nutrient deficiency",
      timing: "Within 1-2 weeks",
      type: "Nitrogen (N) supplement recommended",
    };
  }

  if (ndvi < NDVI_THRESHOLDS.MODERATE_VEGETATION) {
    return {
      priority: "medium",
      action: "Consider balanced NPK application",
      reason: "Support vegetation development",
      timing: "Within 3-4 weeks",
      type: "Balanced NPK (Nitrogen-Phosphorus-Potassium)",
    };
  }

  if (ndvi < NDVI_THRESHOLDS.VERY_HEALTHY) {
    return {
      priority: "low",
      action: "Maintain current fertilization schedule",
      reason: "Vegetation shows good nutrient levels",
      timing: "As per regular schedule",
      type: "Maintenance application only",
    };
  }

  return {
    priority: "very_low",
    action: "No additional fertilization needed",
    reason: "Optimal vegetation health indicates adequate nutrients",
    timing: "Monitor for changes",
    type: "None required",
  };
}

/**
 * Get monitoring recommendations based on confidence
 * @param {string} confidenceLevel - Confidence level
 * @param {number} daysAhead - Days into future
 * @returns {Object} Monitoring recommendation
 */
function getMonitoringRecommendation(confidenceLevel, daysAhead) {
  const baseRecommendation = {
    frequency: "weekly",
    methods: ["Satellite imagery", "Ground observations"],
    parameters: ["NDVI", "Soil moisture", "Weather conditions"],
  };

  if (confidenceLevel === "very_low" || confidenceLevel === "low") {
    return {
      ...baseRecommendation,
      frequency: "every 2-3 days",
      priority: "high",
      reason: "Low prediction confidence requires frequent monitoring",
      alert: "Consider field inspection to verify conditions",
    };
  }

  if (confidenceLevel === "medium" || daysAhead > 60) {
    return {
      ...baseRecommendation,
      frequency: "twice weekly",
      priority: "medium",
      reason: "Medium confidence or long-term prediction needs regular checks",
    };
  }

  return {
    ...baseRecommendation,
    frequency: "weekly",
    priority: "normal",
    reason: "High confidence prediction allows standard monitoring",
  };
}

/**
 * Get timing recommendations for agricultural activities
 * @param {number} ndvi - Predicted NDVI
 * @param {string} targetDate - Target date
 * @param {string} cropType - Type of crop
 * @returns {Object} Timing recommendations
 */
function getTimingRecommendations(ndvi, targetDate, cropType) {
  const recommendations = {
    planting: null,
    harvesting: null,
    spraying: null,
  };

  // Planting recommendations
  if (ndvi < NDVI_THRESHOLDS.SPARSE_VEGETATION) {
    recommendations.planting = {
      suitable: true,
      timing: "Good conditions for planting",
      notes: "Low vegetation cover provides opportunity for new crops",
    };
  }

  // Harvesting recommendations
  if (ndvi > NDVI_THRESHOLDS.HEALTHY_VEGETATION) {
    recommendations.harvesting = {
      suitable: true,
      timing: `Plan harvest around ${targetDate}`,
      notes: "Peak vegetation health indicates maturity approaching",
    };
  }

  // Spraying/pest control
  if (ndvi > NDVI_THRESHOLDS.MODERATE_VEGETATION) {
    recommendations.spraying = {
      suitable: true,
      timing: "Suitable for foliar applications",
      notes: "Good canopy cover for effective treatment",
    };
  }

  return recommendations;
}

/**
 * Generate action items based on NDVI prediction
 * @param {number} ndvi - Predicted NDVI
 * @param {Object} prediction - Full prediction
 * @param {number} currentNDVI - Current NDVI value
 * @returns {Array} Action items
 */
function getActionItems(ndvi, prediction, currentNDVI) {
  const actions = [];
  const { daysAhead } = prediction.prediction;

  // Compare with current NDVI if available
  if (currentNDVI !== null) {
    const change = ndvi - currentNDVI;

    if (change < -0.1) {
      actions.push({
        priority: "high",
        action: "Prepare for declining vegetation health",
        description: `NDVI expected to drop by ${Math.abs(change).toFixed(2)} in ${daysAhead} days`,
        category: "intervention",
      });
    } else if (change > 0.1) {
      actions.push({
        priority: "low",
        action: "Maintain current practices",
        description: `NDVI expected to improve by ${change.toFixed(2)} in ${daysAhead} days`,
        category: "maintenance",
      });
    }
  }

  // General actions based on NDVI level
  if (ndvi < NDVI_THRESHOLDS.SPARSE_VEGETATION) {
    actions.push({
      priority: "high",
      action: "Investigate low vegetation index",
      description: "Check for pest damage, disease, or nutrient deficiency",
      category: "assessment",
    });
  }

  if (ndvi > NDVI_THRESHOLDS.VERY_HEALTHY && daysAhead < 30) {
    actions.push({
      priority: "medium",
      action: "Plan harvesting operations",
      description: "Peak vegetation health approaching - prepare harvest logistics",
      category: "planning",
    });
  }

  return actions;
}

/**
 * Generate alerts for concerning conditions
 * @param {number} ndvi - Predicted NDVI
 * @param {Object} prediction - Full prediction
 * @param {number} currentNDVI - Current NDVI
 * @returns {Array} Alert messages
 */
function generateAlerts(ndvi, prediction, currentNDVI) {
  const alerts = [];
  const { lowerBound } = prediction.prediction;
  const { percentage: confidence } = prediction.confidence;

  // Low NDVI alert
  if (ndvi < NDVI_THRESHOLDS.SPARSE_VEGETATION) {
    alerts.push({
      level: "warning",
      message: "Low vegetation index predicted",
      impact: "Potential crop stress or poor growth",
      action: "Immediate field assessment recommended",
    });
  }

  // Declining trend alert
  if (currentNDVI !== null && ndvi < currentNDVI - 0.15) {
    alerts.push({
      level: "critical",
      message: "Significant decline in vegetation health predicted",
      impact: "Risk of crop failure or yield loss",
      action: "Urgent intervention required",
    });
  }

  // Low confidence alert
  if (confidence < 50) {
    alerts.push({
      level: "info",
      message: "Low prediction confidence",
      impact: "Prediction may be less reliable",
      action: "Increase monitoring frequency and verify with ground truth",
    });
  }

  // Very low lower bound alert
  if (lowerBound < NDVI_THRESHOLDS.BARE_SOIL) {
    alerts.push({
      level: "warning",
      message: "Worst-case scenario shows very low vegetation",
      impact: "Possible crop failure in unfavorable conditions",
      action: "Prepare contingency plans",
    });
  }

  return alerts;
}

/**
 * Get crop-specific recommendations
 * @param {string} cropType - Type of crop
 * @param {number} ndvi - Predicted NDVI
 * @param {Object} prediction - Full prediction
 * @returns {Object} Crop-specific recommendations
 */
function getCropSpecificRecommendations(cropType, ndvi, prediction) {
  const cropData = {
    corn: {
      optimalNDVI: { min: 0.6, max: 0.85 },
      criticalStages: ["V6 (6-leaf)", "VT (tasseling)", "R1 (silking)"],
      notes: "Monitor nitrogen levels during vegetative growth",
    },
    wheat: {
      optimalNDVI: { min: 0.5, max: 0.75 },
      criticalStages: ["Tillering", "Booting", "Heading"],
      notes: "Peak NDVI occurs during heading stage",
    },
    soybean: {
      optimalNDVI: { min: 0.6, max: 0.8 },
      criticalStages: ["V3-V5", "R1 (flowering)", "R5 (seed fill)"],
      notes: "Maintain adequate moisture during pod fill",
    },
    rice: {
      optimalNDVI: { min: 0.65, max: 0.85 },
      criticalStages: ["Tillering", "Panicle initiation", "Flowering"],
      notes: "Keep fields flooded during critical growth stages",
    },
  };

  const crop = cropData[cropType.toLowerCase()] || cropData.corn;

  return {
    cropType,
    optimalRange: crop.optimalNDVI,
    status:
      ndvi >= crop.optimalNDVI.min && ndvi <= crop.optimalNDVI.max
        ? "Within optimal range"
        : ndvi < crop.optimalNDVI.min
          ? "Below optimal - needs attention"
          : "Above optimal - monitor for issues",
    criticalStages: crop.criticalStages,
    notes: crop.notes,
  };
}

/**
 * Generate complete recommendation report
 * @param {Object} prediction - NDVI prediction result
 * @param {Object} options - Additional options
 * @returns {Object} Complete recommendation report
 */
export function generateRecommendationReport(prediction, options = {}) {
  const recommendations = generateRecommendations(prediction, options);

  return {
    prediction: prediction.prediction,
    confidence: prediction.confidence,
    recommendations,
    generatedAt: new Date().toISOString(),
  };
}
