"use client";

import Link from "next/link";
import { FaLeaf } from "react-icons/fa";
import { FaCoins } from "react-icons/fa6";
import { usePoints } from "@/context/PointsContext";
import Image from "next/image";

const Header = () => {
	const { points } = usePoints();

	return (
		<header className="bg-gradient-to-r from-green-700 via-emerald-600 to-green-800 text-white py-4 px-6 flex justify-between items-center shadow-lg backdrop-blur-md border-b border-green-500/30">
			{/* Logo / Home Link */}
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

			{/* Points Display */}
			<div className="flex items-center text-lg font-medium bg-green-900/30 px-4 py-2 rounded-full border border-lime-300/40 shadow-inner">
				<FaCoins className="text-yellow-400 text-2xl mr-2 drop-shadow" />
				<span className="text-lime-100 mr-2">Points:</span>
				<span className="font-semibold text-yellow-300">{points}</span>
			</div>
		</header>
	);
};

export default Header;
