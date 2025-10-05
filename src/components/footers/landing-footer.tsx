import Image from "next/image";

export default function LandingFooter() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Bloom Minds Logo"
              className="w-6 h-6"
              width={100}
              height={100}
            />
            <span className="font-bold">
              Bloom <span className="text-primary">Minds</span> Explorer
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            NASA Space Apps Challenge 2025 • Built with NASA GIBS Data
          </p>
        </div>
      </div>
    </footer>
  );
}
