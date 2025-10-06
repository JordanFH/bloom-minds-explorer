import {
  Gamepad,
  Globe,
  ListCheck,
  Satellite,
} from 'lucide-react';

import { Card } from '../ui/card';

export default function SolutionSection() {
  return (
    <section id="solution" className="py-20 map-with-starry-bg">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Our Solution</h2>
          <p className="text-xl text-muted-foreground text-pretty text-white">
            <b>BloomMinds</b> presents <b>Bloom Explorer</b>, an interactive 3D platform that
            visualizes the globe and leverages <b>NASA's GIBS</b> data to track vegetation changes
            and flowering events in near real-time. Additionally, we offer <b>Bloom Quiz</b>, an
            educational experience designed to learn about vegetation, flowering cycles, and plant
            pollination.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto ">
          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Satellite className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">NASA GIBS Integration</h3>
            <p className="text-muted-foreground leading-relaxed">
              Real-time access to NDVI, surface temperature, and true-color satellite imagery from NASA.
            </p>
          </Card>
          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Interactive 3D Globe</h3>
            <p className="text-muted-foreground leading-relaxed">
              Explore vegetation data worldwide with multiple projections and dynamic map styles.
            </p>
          </Card>
          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <ListCheck className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Bloom Quiz</h3>
            <p className="text-muted-foreground leading-relaxed">
              Learn about phenology, pollination, and biodiversity through an interactive quiz experience.
            </p>
          </Card>
          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Gamepad className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Bloom Game</h3>
            <p className="text-muted-foreground leading-relaxed">
              Play <span className="font-semibold text-primary">"🌿 THE LAST BOTANIST"</span> and restore life to a dying Earth.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}