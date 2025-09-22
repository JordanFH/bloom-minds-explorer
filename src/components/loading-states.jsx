/**
 * Loading states and error components for BloomWatch
 */

/**
 * NASA data loading spinner
 */
export function NasaDataLoader({ isLoading, error, children }) {
  if (error) {
    return (
      <div className="flex items-center space-x-2 text-red-600 text-xs">
        <span>⚠️</span>
        <span>NASA data unavailable</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-blue-600 text-xs">
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
        <span>Loading NASA data...</span>
      </div>
    );
  }

  return children;
}

/**
 * Map loading overlay
 */
export function MapLoadingOverlay({ isVisible, message = "Loading map data..." }) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="text-gray-700">{message}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Error boundary for NASA API failures
 */
export function NasaErrorBoundary({ error, retry, children }) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-red-600">🛰️</span>
          <h3 className="font-medium text-red-800">NASA Data Error</h3>
        </div>
        <p className="text-red-700 text-sm mb-3">{error.message}</p>
        <div className="flex space-x-2">
          <button
            onClick={retry}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return children;
}

/**
 * Bloom analysis loading state
 */
export function BloomAnalysisLoader({ isAnalyzing, region }) {
  if (!isAnalyzing) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full mx-4">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <div className="w-16 h-16 bg-green-200 rounded-full mx-auto flex items-center justify-center">
              <span className="text-2xl">🌸</span>
            </div>
          </div>
          <h3 className="font-medium text-gray-800 mb-2">Analyzing Bloom Data</h3>
          <p className="text-gray-600 text-sm mb-4">
            Processing NASA vegetation indices for {region?.name}...
          </p>
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full animate-pulse"
                style={{ width: "60%" }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Downloading MODIS data</span>
              <span>60%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Data status indicator
 */
export function DataStatusIndicator({ status, lastUpdate }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "connected":
        return "bg-green-500";
      case "loading":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-300";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "connected":
        return "Live Data";
      case "loading":
        return "Updating";
      case "error":
        return "Error";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="flex items-center space-x-2 text-xs">
      <div
        className={`w-2 h-2 rounded-full ${getStatusColor(status)} ${status === "loading" ? "animate-pulse" : ""}`}
      ></div>
      <span className="text-gray-600">{getStatusText(status)}</span>
      {lastUpdate && (
        <span className="text-gray-400">{new Date(lastUpdate).toLocaleTimeString()}</span>
      )}
    </div>
  );
}

/**
 * Skeleton loader for components
 */
export function SkeletonLoader({ className = "" }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-200 rounded h-4 w-3/4 mb-2"></div>
      <div className="bg-gray-200 rounded h-4 w-1/2 mb-2"></div>
      <div className="bg-gray-200 rounded h-4 w-5/6"></div>
    </div>
  );
}

/**
 * Connection status for NASA APIs
 */
export function ConnectionStatus({ apis = {} }) {
  const apiList = [
    { name: "GIBS", key: "gibs", description: "Satellite imagery" },
    { name: "AppEEARS", key: "appeears", description: "Time series data" },
    { name: "CMR", key: "cmr", description: "Data catalog" },
  ];

  return (
    <div className="bg-gray-50 rounded-lg p-3 border">
      <h4 className="font-medium text-sm mb-2 flex items-center">
        <span className="mr-2">🛰️</span>
        NASA API Status
      </h4>
      <div className="space-y-1">
        {apiList.map((api) => {
          const status = apis[api.key] || "unknown";
          return (
            <div key={api.key} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <DataStatusIndicator status={status} />
                <span>{api.name}</span>
              </div>
              <span className="text-gray-500">{api.description}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
