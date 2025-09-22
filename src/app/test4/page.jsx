"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Enhanced BloomWatch with NASA integration
const BloomWatchMap = dynamic(() => import("@/components/bloom-watch-map"), {
  ssr: false,
  loading: () => <NasaMapLoading />,
});

// NASA-themed loading component
function NasaMapLoading() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-black text-white">
      <div className="text-center">
        <div className="animate-pulse mb-6">
          <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
            <span className="text-4xl">🛰️</span>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2">NASA BloomWatch</h2>
        <p className="text-blue-200 mb-4">
          Loading satellite vegetation data...
        </p>
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
        <div className="mt-6 text-xs text-blue-300">
          <div>🌍 MODIS • VIIRS • Landsat</div>
          <div className="mt-1">NASA Space Apps Challenge 2025</div>
        </div>
      </div>
    </div>
  );
}

export default function NasaBloomWatchPage() {
  return (
    <div className="w-full h-screen">
      <Suspense fallback={<NasaMapLoading />}>
        <BloomWatchMap />
      </Suspense>
    </div>
  );
}
