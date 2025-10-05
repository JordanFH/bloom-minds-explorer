import { ButtonOpenExplorer } from "../buttons/open-explorer";

export default function CtaSection() {
  return (
    <section className="py-20 map-with-starry-bg text-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance text-white">
            Ready to experience something different with Bloom Explorer?
          </h2>
          <p className="text-xl text-white/90 mb-8 text-pretty">
            Experience the power of NASA satellite data to track plant blooming across our planet
            with Bloom Explorer.
          </p>
          <ButtonOpenExplorer />
        </div>
      </div>
    </section>
  );
}