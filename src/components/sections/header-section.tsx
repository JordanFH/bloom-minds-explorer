import Image from "next/image";
import { ButtonOpenExplorer } from "../buttons/open-explorer";
import Link from "next/link";

export default function HeaderSection() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-green-800 text-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link className="flex items-center gap-3" href="/">
          <Image
            src="/logo-2.png"
            alt="Bloom Minds Logo"
            className="w-12 h-12"
            width={100}
            height={100}
          />
          <span className="text-xl font-bold">
            Bloom <span className="text-primary">Minds</span>
          </span>
        </Link>
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
        <ButtonOpenExplorer type="navbar" />
      </div>
    </header>
  );
}