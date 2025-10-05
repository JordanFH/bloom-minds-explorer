import { Database, Globe, Leaf } from "lucide-react";
import { Card } from "../ui/card";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Key Features</h2>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          <Card className="p-8 bg-card border-border">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">NDVI Vegetation Index</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Visualize vegetation health and density using the Normalized Difference Vegetation
                  Index, with color-coded overlays showing areas of high and low vegetation
                  activity.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-card border-border">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Database className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Multi-Layer Data Visualization</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Toggle between different NASA GIBS data layers including true color imagery,
                  surface temperature, and vegetation indices to gain comprehensive insights.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-card border-border">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Time-Series Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Track vegetation changes over time with date selection controls, enabling the
                  detection of blooming events and seasonal patterns across different regions.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
