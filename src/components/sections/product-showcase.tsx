import { Globe, Leaf, Satellite, TrendingUp } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

export default function ProductShowcase() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray/5 via-gray/5 to-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-20 w-40 h-40 bg-primary rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-20 w-48 h-48 bg-accent rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-primary rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            {/* className="mb-4 bg-primary/20 text-primary border-primary/30" */}
            <Badge variant="secondary" className="mb-4">
              <Globe className="w-3 h-3 mr-1" />
              Plataforma Interactiva
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Bloom Minds
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Explorer
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Una plataforma interactiva de visualización 3D que aprovecha los datos de NASA GIBS
              para rastrear cambios en la vegetación y eventos de floración en tiempo real
            </p>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border border-primary/20 bg-card w-[80%] ml-12 flex">
              <img
                src="/explore.png"
                alt="Bloom Minds Explorer Interface"
                className="w-full h-auto m-auto"
              />
            </div>

            <div className="hidden lg:block">
              <div className="absolute left-4 top-1/4 transform -translate-x-full">
                <Card className="p-4 bg-card border-primary/30 shadow-lg max-w-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Satellite className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">NASA GIBS Data</p>
                      <p className="text-xs text-muted-foreground">Real-time satellite imagery</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="absolute right-32 top-1/3 transform translate-x-full">
                <Card className="p-4 bg-card border-accent/30 shadow-lg max-w-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">NDVI Analysis</p>
                      <p className="text-xs text-muted-foreground">Vegetation health tracking</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="absolute left-4 bottom-1/4 transform -translate-x-full">
                <Card className="p-4 bg-card border-primary/30 shadow-lg max-w-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">3D Globe View</p>
                      <p className="text-xs text-muted-foreground">Interactive exploration</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="absolute right-32 bottom-1/3 transform translate-x-full">
                <Card className="p-4 bg-card border-accent/30 shadow-lg max-w-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Climate Data</p>
                      <p className="text-xs text-muted-foreground">Annual temperature trends</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">3D</div>
              <p className="text-sm text-muted-foreground">Interactive Globe</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">Real-time</div>
              <p className="text-sm text-muted-foreground">NASA Data</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">Multi-layer</div>
              <p className="text-sm text-muted-foreground">Data Visualization</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">Global</div>
              <p className="text-sm text-muted-foreground">Coverage</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
