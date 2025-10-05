import Image from "next/image";
import { ButtonOpenExplorer } from "../buttons/open-explorer";

export default function HeaderSection() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-green-800 text-white">
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
            Reto
          </a>
          <a href="#solution" className="text-sm hover:text-primary transition-colors">
            Solución
          </a>
          <a href="#features" className="text-sm hover:text-primary transition-colors">
            Características
          </a>
          <a href="#team" className="text-sm hover:text-primary transition-colors">
            Equipo
          </a>
        </nav>
        <ButtonOpenExplorer type="navbar" />
      </div>
    </header>
  );
}
