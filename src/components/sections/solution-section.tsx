import { Globe, Satellite, TrendingUp } from "lucide-react";
import { Card } from "../ui/card";

export default function SolutionSection() {
  return (
    <section id="solution" className="py-20 map-with-starry-bg">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Nuestra solución</h2>
          <p className="text-xl text-muted-foreground text-pretty">
            <b>BloomMinds</b> presenta <b>Bloom Explorer</b>, una plataforma interactiva en 3D que
            visualiza el globo terráqueo y aprovecha los datos <b>GIBS</b> de la <b>NASA</b> para
            rastrear los cambios en la vegetación y los eventos de floración en tiempo casi real.
            Además, contamos con <b>Bloom Quiz</b>, una experiencia educativa diseñada para aprender
            sobre la vegetación, los ciclos de floración y la polinización de las plantas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto ">
          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Satellite className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Integración con GIBS de la NASA</h3>
            <p className="text-muted-foreground leading-relaxed">
              Acceso en tiempo real a NDVI, temperatura superficial e imágenes satelitales en color
              real
            </p>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Globo terráqueo 3D interactivo</h3>
            <p className="text-muted-foreground leading-relaxed">
              Explora datos de vegetación con múltiples proyecciones y estilos de mapa.
            </p>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Bloom Quiz</h3>
            <p className="text-muted-foreground leading-relaxed">
              Descubre cómo la Tierra vive y respira con cada estación. Aprende sobre fenología,
              polinización, cambio climático y biodiversidad mientras floreces con cada respuesta.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
