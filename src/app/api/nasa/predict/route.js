/**
 * NDVI Prediction API Endpoint
 * POST /api/nasa/predict - Predict future NDVI values
 * GET /api/nasa/predict/forecast - Generate forecast for multiple dates
 */

import { NextResponse } from "next/server";
import { predictNDVI, generateForecast } from "@/lib/ndvi-prediction.js";
import { generateRecommendationReport } from "@/lib/agronomic-recommendations.js";

/**
 * POST /api/nasa/predict
 * Predict NDVI for a specific future date
 *
 * Request body:
 * {
 *   lat: number,
 *   lon: number,
 *   targetDate: string (ISO format),
 *   yearsHistory?: number (default 3),
 *   cropType?: string (optional),
 *   currentNDVI?: number (optional),
 *   includeRecommendations?: boolean (default true)
 * }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      lat,
      lon,
      targetDate,
      yearsHistory = 3,
      cropType = "general",
      currentNDVI = null,
      includeRecommendations = true,
    } = body;

    // Validate required fields
    if (lat === undefined || lon === undefined || !targetDate) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["lat", "lon", "targetDate"],
          received: { lat, lon, targetDate },
        },
        { status: 400 },
      );
    }

    // Validate latitude and longitude
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return NextResponse.json(
        {
          error: "Invalid coordinates",
          details: "Latitude must be between -90 and 90, longitude between -180 and 180",
        },
        { status: 400 },
      );
    }

    // Validate target date
    const target = new Date(targetDate);
    if (isNaN(target.getTime())) {
      return NextResponse.json(
        {
          error: "Invalid target date",
          details: "Target date must be in ISO format (YYYY-MM-DD)",
        },
        { status: 400 },
      );
    }

    // Validate target date is in the future
    if (target <= new Date()) {
      return NextResponse.json(
        {
          error: "Invalid target date",
          details: "Target date must be in the future",
        },
        { status: 400 },
      );
    }

    // Check prediction range (max 90 days)
    const daysAhead = Math.floor((target - new Date()) / (1000 * 60 * 60 * 24));
    if (daysAhead > 90) {
      return NextResponse.json(
        {
          error: "Prediction range exceeded",
          details: "Predictions are only available up to 90 days in advance",
          daysRequested: daysAhead,
          maxDays: 90,
        },
        { status: 400 },
      );
    }

    // Generate prediction
    const prediction = await predictNDVI(lat, lon, targetDate, yearsHistory);

    // Add recommendations if requested
    let response = prediction;
    if (includeRecommendations) {
      const recommendationOptions = {
        cropType,
        currentNDVI,
      };
      response = generateRecommendationReport(prediction, recommendationOptions);
    }

    return NextResponse.json({
      success: true,
      data: response,
      requestInfo: {
        coordinates: { lat, lon },
        targetDate: target.toISOString().split("T")[0],
        daysAhead,
        yearsAnalyzed: yearsHistory,
      },
    });
  } catch (error) {
    console.error("NDVI prediction error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Prediction failed",
        details: error.message,
        type: "PREDICTION_ERROR",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/nasa/predict?lat=x&lon=y&days=30&interval=7
 * Generate forecast for multiple future dates
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const lat = parseFloat(searchParams.get("lat"));
    const lon = parseFloat(searchParams.get("lon"));
    const days = parseInt(searchParams.get("days") || "30");
    const interval = parseInt(searchParams.get("interval") || "7");
    const yearsHistory = parseInt(searchParams.get("yearsHistory") || "3");

    // Validate parameters
    if (isNaN(lat) || isNaN(lon)) {
      return NextResponse.json(
        {
          error: "Missing or invalid coordinates",
          details: "Both lat and lon parameters are required as numbers",
        },
        { status: 400 },
      );
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return NextResponse.json(
        {
          error: "Invalid coordinates",
          details: "Latitude must be between -90 and 90, longitude between -180 and 180",
        },
        { status: 400 },
      );
    }

    if (days < 1 || days > 90) {
      return NextResponse.json(
        {
          error: "Invalid forecast period",
          details: "Days must be between 1 and 90",
        },
        { status: 400 },
      );
    }

    if (interval < 1 || interval > days) {
      return NextResponse.json(
        {
          error: "Invalid interval",
          details: "Interval must be between 1 and the forecast period",
        },
        { status: 400 },
      );
    }

    // Generate forecast
    const forecast = await generateForecast(lat, lon, days, interval, yearsHistory);

    return NextResponse.json({
      success: true,
      data: forecast,
    });
  } catch (error) {
    console.error("Forecast generation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Forecast generation failed",
        details: error.message,
        type: "FORECAST_ERROR",
      },
      { status: 500 },
    );
  }
}
