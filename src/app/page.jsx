import LandingFooter from "../components/footers/landing-footer";
import ChallengeSection from "../components/sections/challenge-section";
import CtaSection from "../components/sections/cta-section";
import FeaturesSection from "../components/sections/features-section";
import HeaderSection from "../components/sections/header-section";
import HeroSection from "../components/sections/hero-section";
import ProductShowcase from "../components/sections/product-showcase";
import SolutionSection from "../components/sections/solution-section";
import TeamSection from "../components/sections/team-section";

export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: 'url("/bg-2.jpg")',
        backgroundRepeat: "repeat",
        backgroundSize: "200px 100px", // ajusta el tamaño que necesites
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div className="bg-gradient-to-br from-emerald-50/95 via-lime-200/95 to-green-300/95">
        {/* Header */}
        <HeaderSection />

        {/* Hero Section */}
        <HeroSection />

        {/* Product Showcase */}
        <ProductShowcase />

        {/* Challenge Section */}
        <ChallengeSection />

        {/* Solution Section */}
        <SolutionSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Team Section */}
        <TeamSection />

        {/* CTA Section */}
        <CtaSection />

        {/* Footer */}
        <LandingFooter />
      </div>
    </div>
  );
}
