export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold">Welcome to Bloom Minds Explorer</h1>
        <p className="text-lg text-gray-600">
          Visualize and analyze satellite data for monitoring plant blooms.
        </p>
      </div>
    </div>
  );
}
