import { Globe, Leaf, Satellite, TrendingUp } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

export default function ChallengeSection() {
  return (
    <section
      id="challenge"
      className="py-20 relative overflow-hidden bg-gradient-to-bl from-gray-50/45 via-gray-200/10 to-gray-300/55"
    >
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
                        El <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Reto</span>
                    </h2> */}
          {/* <p className="text-center text-muted-foreground mb-12 text-lg">
                        BloomWatch: An Earth Observation Application for Global Flowering Phenology
                    </p> */}

          <Card className="p-8 md:p-10 bg-card border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold">The Challenge</h3>
              </div>

              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                Witness the pulse of life across our planet! From season to season and year to year,{" "}
                <span className="text-primary font-semibold">
                  Earth's vegetation is constantly changing
                </span>
                , providing critical information on plant species, crops, seasonal effects, pollen
                sources, and changes in plant phenology (the relationship between seasonal changes
                and climate and biological phenomena in plants).
              </p>

              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                Your challenge is to
                <span className="text-accent font-semibold">
                  harness the power of NASA Earth observations
                </span>{" "}
                to create a dynamic visual tool that displays and/or detects plant blooming events
                around the globe—
                <span className="text-primary font-semibold">just like pollinators do</span>—and
                that advances solutions for monitoring, predicting, or managing vegetation.
              </p>

              <div className="flex flex-wrap gap-2">
                <Badge className="border-primary/30 text-primary">
                  <Satellite className="w-3 h-3 mr-1" />
                  NASA Earth Observations
                </Badge>
                <Badge className="border-accent/30 text-accent">
                  <Leaf className="w-3 h-3 mr-1" />
                  Plant Phenology
                </Badge>
                <Badge className="border-primary/30 text-primary">
                  <Globe className="w-3 h-3 mr-1" />
                  Global Monitoring
                </Badge>
                <Badge className="border-accent/30 text-accent">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Blooming Events
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
