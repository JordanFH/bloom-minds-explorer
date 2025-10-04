import { Database, Globe, Leaf, Satellite, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: 'url("/bg-2.png")',
        backgroundRepeat: "repeat",
        backgroundSize: "auto", // o el tamaño que prefieras
      }}
    >
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-lg bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Bloom Minds Logo"
              className="w-10 h-10"
              width={100}
              height={100}
            />
            <span className="text-xl fon  t-bold">
              Bloom <span className="text-primary">Minds</span> Explorer
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#challenge" className="text-sm hover:text-primary transition-colors">
              Challenge
            </a>
            <a href="#solution" className="text-sm hover:text-primary transition-colors">
              Solution
            </a>
            <a href="#features" className="text-sm hover:text-primary transition-colors">
              Features
            </a>
            <a href="#team" className="text-sm hover:text-primary transition-colors">
              Team
            </a>
          </nav>
          <Link href={"/explore"}>
            <Button size="sm" className="hidden md:inline-flex">
              Try Explorer
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/20 via-accent/20 to-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-pulse" />
          <div className="absolute top-40 right-20 w-1 h-1 bg-accent rounded-full animate-pulse delay-300" />
          <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-primary rounded-full animate-pulse delay-700" />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent rounded-full animate-pulse delay-500" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30">
              NASA Space Apps Challenge 2024
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight">
              Witness the Pulse of Life Across Our Planet
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty leading-relaxed">
              Harnessing NASA Earth observations to create a dynamic visual tool that displays and
              detects plant blooming events around the globe
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={"/explore"}>
                <Button size="lg" className="text-lg px-8">
                  <Globe className="w-5 h-5 mr-2" />
                  Explore the Globe
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 bg-background/10 border-background/30 text-background hover:bg-background/20 hover:text-background"
              >
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border border-primary/20 bg-card">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-kRL1VVssgDE9YfXAdLE9mfHGQXNMd5.png"
                alt="Bloom Minds Explorer Interface"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section id="challenge" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">The Challenge</h2>
            <Card className="p-8 md:p-12 bg-card border-border">
              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                From season to season and year to year, Earth's vegetation is constantly changing,
                providing critical information on plant species, crops, seasonal effects, pollen
                sources, and changes in plant phenology—the relationship between seasonal changes
                and climate and biological phenomena in plants.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Our challenge is to harness the power of NASA Earth observations to create a dynamic
                visual tool that displays and detects plant blooming events around the globe—just
                like pollinators do—and that advances solutions for monitoring, predicting, or
                managing vegetation.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Solution</h2>
            <p className="text-xl text-muted-foreground text-pretty">
              Bloom Minds Explorer is an interactive 3D globe visualization platform that leverages
              NASA GIBS data to track vegetation changes and blooming events in real-time
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Satellite className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">NASA GIBS Integration</h3>
              <p className="text-muted-foreground leading-relaxed">
                Real-time access to NDVI, surface temperature, and true color satellite imagery
              </p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Interactive 3D Globe</h3>
              <p className="text-muted-foreground leading-relaxed">
                Explore vegetation data with multiple projections and map styles
              </p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Climate Analytics</h3>
              <p className="text-muted-foreground leading-relaxed">
                Access annual climate data and temperature trends for any location
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
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
                    Visualize vegetation health and density using the Normalized Difference
                    Vegetation Index, with color-coded overlays showing areas of high and low
                    vegetation activity.
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

      {/* Team Section */}
      <section id="team" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Team</h2>
            <p className="text-xl text-muted-foreground">
              Five passionate innovators united by a mission to visualize Earth's vegetation
            </p>
          </div>

          <Card className="max-w-3xl mx-auto p-8 md:p-12 bg-card border-border">
            <div className="flex items-center justify-center gap-4 mb-8">
              <Users className="w-12 h-12 text-primary" />
              <span className="text-6xl font-bold text-primary">5</span>
            </div>
            <p className="text-center text-lg text-muted-foreground leading-relaxed">
              Our multidisciplinary team combines expertise in data visualization, Earth sciences,
              software development, and UX design to create an innovative solution for the NASA
              Space Apps Challenge.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-accent to-primary/80 text-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance text-white">
              Ready to Explore Earth's Vegetation?
            </h2>
            <p className="text-xl text-white/90 mb-8 text-pretty">
              Experience the power of NASA satellite data in tracking plant blooming events across
              our planet
            </p>
            <Button size="lg" className="text-lg px-8 bg-white text-foreground hover:bg-white/90">
              <Globe className="w-5 h-5 mr-2" />
              Launch Explorer
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Bloom Minds Logo" className="w-6 h-6" />
              <span className="font-bold">
                Bloom <span className="text-primary">Minds</span> Explorer
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              NASA Space Apps Challenge 2024 • Built with NASA GIBS Data
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
