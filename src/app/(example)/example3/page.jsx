"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Importación dinámica optimizada
const BloomWatchMap = dynamic(() => import("@/components/bloom-watch-map"), {
  ssr: false,
  loading: () => <MapLoading />,
});

// Componente de loading separado para evitar re-creaciones
function MapLoading() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando mapa...</p>
      </div>
    </div>
  );
}

export default function MapaPage() {
  return (
    <Suspense fallback={<MapLoading />}>
      <div style={{ width: "100%", height: "100vh" }}>
        <BloomWatchMap />
      </div>
    </Suspense>
  );
}
