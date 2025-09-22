/**
 * AppEEARS API integration endpoints
 * Handles NASA authentication and data requests
 */

import { NextResponse } from "next/server";
import { AppEEARSClient, NasaAuth } from "@/lib/nasa-api";

// Initialize NASA authentication
const nasaAuth = new NasaAuth();

/**
 * POST /api/nasa/appeears
 * Submit vegetation analysis task to AppEEARS
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { taskName, coordinates, startDate, endDate, layers, credentials } =
      body;

    // Validate required fields
    if (!taskName || !coordinates || !startDate || !endDate) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: taskName, coordinates, startDate, endDate",
        },
        { status: 400 },
      );
    }

    // For demo purposes, return mock data if no credentials provided
    if (!credentials || !credentials.username || !credentials.password) {
      const mockResponse = {
        task_id: `mock_${Date.now()}`,
        task_name: taskName,
        status: "queued",
        message: "Mock task created for demo purposes",
        estimated_completion: new Date(
          Date.now() + 5 * 60 * 1000,
        ).toISOString(),
        coordinates: coordinates,
        date_range: { startDate, endDate },
        layers: layers || ["NDVI", "EVI"],
      };

      return NextResponse.json(mockResponse);
    }

    // Authenticate with NASA
    if (!nasaAuth.isTokenValid()) {
      await nasaAuth.authenticate(credentials.username, credentials.password);
    }

    // Create AppEEARS client
    const client = new AppEEARSClient(nasaAuth);

    // Submit analysis task
    const taskResponse = await client.submitTask({
      taskName,
      coordinates,
      startDate,
      endDate,
      layers,
    });

    return NextResponse.json(taskResponse);
  } catch (error) {
    console.error("AppEEARS API error:", error);

    return NextResponse.json(
      {
        error: "Failed to submit AppEEARS task",
        details: error.message,
        type: "APPEEARS_ERROR",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/nasa/appeears?taskId=xxx
 * Get task status and results
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json(
        { error: "Missing taskId parameter" },
        { status: 400 },
      );
    }

    // Handle mock task IDs
    if (taskId.startsWith("mock_")) {
      const mockStatus = {
        task_id: taskId,
        status: "completed",
        progress: 100,
        created: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        updated: new Date().toISOString(),
        results: {
          summary: {
            total_points: 1,
            date_range: "2024-01-01 to 2024-12-31",
            products: ["MOD13Q1.061"],
            layers: ["NDVI", "EVI"],
          },
          data_url: `/api/nasa/appeears/download?taskId=${taskId}`,
          preview: {
            ndvi_mean: 0.65,
            evi_mean: 0.42,
            vegetation_health: "good",
            bloom_probability: 0.75,
          },
        },
      };

      return NextResponse.json(mockStatus);
    }

    // Real AppEEARS integration
    if (!nasaAuth.isTokenValid()) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const client = new AppEEARSClient(nasaAuth);
    const status = await client.getTaskStatus(taskId);

    return NextResponse.json(status);
  } catch (error) {
    console.error("AppEEARS status check error:", error);

    return NextResponse.json(
      {
        error: "Failed to check task status",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
