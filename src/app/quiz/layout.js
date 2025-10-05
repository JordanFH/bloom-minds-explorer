
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PointsProvider } from "@/context/PointsContext";

export const metadata = {
  title: "Quiz App",
  description: "Quiz App For Students",
};

export default function Layout({ children }) {
  return (
    <div>
      <body>
        <PointsProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </PointsProvider>
      </body>
    </div>
  );
}
