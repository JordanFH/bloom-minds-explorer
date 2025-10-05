import { MapPinMinusIcon } from "lucide-react";
import ButtonBloomQuiz from "../buttons/button-bloom-quiz";
import { ButtonOpenExplorer } from "../buttons/open-explorer";
import { Badge } from "../ui/badge";

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 relative overflow-hidden bg-gradient-to-bl from-gray-50/45 via-gray-200/10 to-gray-300/55">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-accent rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-primary rounded-full animate-pulse delay-700" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent rounded-full animate-pulse delay-500" />
      </div>

      <div className="mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <Badge>
            <MapPinMinusIcon className="w-4 h-4 mr-2" /> Cajamarca
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight">
            NASA Space Apps Challenge 2025 ·
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              BloomMinds
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty leading-relaxed">
            Vive una experiencia visual única con datos de la NASA: explora el planeta con{" "}
            <b>Bloom Explorer</b> o aprende sobre floración y vegetación en los <b>Bloom Quiz.</b>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonOpenExplorer />
            <ButtonBloomQuiz />
          </div>
        </div>
      </div>
    </section>
  );
}
