import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ButtonBloomGame() {
	return (
		<Link href={"/game.html"} target="_blank">
			<Button
				size="lg"
				variant="outline"
				className="text-lg px-8 transition-colors duration-300 bg-sky-700 hover:bg-sky-800 text-white"
			>
				Bloom Game
			</Button>
		</Link>
	);
}
