import { Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  type?: "default" | "navbar";
}

export function ButtonOpenExplorer({ type = "default" }: Props) {
  if (type === "navbar")
    return (
      <Link href={"/explore"}>
        <Button
          size="sm"
          className="hidden md:inline-flex bg-white text-green-800 hover:bg-yellow-500 hover:text-white transition-all duration-300"
        >
          Explorer
        </Button>
      </Link>
    );
  return (
    <Link href={"/explore"}>
      <Button
        size="lg"
        className="bg-white hover:bg-gray-100/80 transition-all duration-300 text-lg px-8"
      >
        <Globe className="w-5 h-5 mr-2" />
        Open Explorer
      </Button>
    </Link>
  );
}