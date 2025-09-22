/**
 * AppEEARS data download endpoint
 * Handles result downloads and data processing
 */

import { NextResponse } from "next/server";

/**
 * GET /api/nasa/appeears/download?taskId=xxx
 * Download and process AppEEARS results
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");
    const format = searchParams.get("format") || "json";

    if (!taskId) {
      return NextResponse.json(
        { error: "Missing taskId parameter" },
        { status: 400 },
      );
    }

    // Handle mock data for demo
    if (taskId.startsWith("mock_")) {
      const mockData = generateMockTimeSeriesData();

      if (format === "csv") {
        const csv = convertToCSV(mockData);
        return new NextResponse(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="bloom_analysis_${taskId}.csv"`,
          },
        });
      }

      return NextResponse.json({
        task_id: taskId,
        download_date: new Date().toISOString(),
        data: mockData,
        metadata: {
          total_records: mockData.length,
          date_range: {
            start: mockData[0]?.date,
            end: mockData[mockData.length - 1]?.date,
          },
          variables: ["NDVI", "EVI", "LST_Day"],
          spatial_resolution: "250m",
          temporal_resolution: "16-day",
        },
      });
    }

    // Real AppEEARS data processing would go here
    return NextResponse.json(
      { error: "Real AppEEARS integration not implemented" },
      { status: 501 },
    );
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to download data", details: error.message },
      { status: 500 },
    );
  }
}

/**
 * Generate mock time series data for demo
 */
function generateMockTimeSeriesData() {
  const data = [];
  const startDate = new Date("2024-01-01");
  const endDate = new Date("2024-12-31");

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 16)) {
    const dayOfYear = Math.floor(
      (d - new Date(d.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24),
    );

    // Simulate seasonal vegetation patterns
    const seasonalFactor = Math.sin(
      (dayOfYear / 365) * 2 * Math.PI - Math.PI / 2,
    );

    data.push({
      date: d.toISOString().split("T")[0],
      ndvi: Math.max(
        0.1,
        0.5 + seasonalFactor * 0.3 + (Math.random() - 0.5) * 0.1,
      ),
      evi: Math.max(
        0.05,
        0.3 + seasonalFactor * 0.2 + (Math.random() - 0.5) * 0.05,
      ),
      lst_day: 20 + seasonalFactor * 10 + (Math.random() - 0.5) * 5,
      quality_flag: Math.random() > 0.9 ? "cloudy" : "good",
      bloom_probability: Math.max(
        0,
        seasonalFactor > 0.5
          ? seasonalFactor + (Math.random() - 0.5) * 0.2
          : 0.1,
      ),
    });
  }

  return data;
}

/**
 * Convert data to CSV format
 */
function convertToCSV(data) {
  if (!data.length) return "";

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) => headers.map((field) => row[field]).join(",")),
  ].join("\n");

  return csvContent;
}
