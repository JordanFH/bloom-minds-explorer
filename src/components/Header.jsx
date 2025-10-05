"use client";

import Link from "next/link";
import { FaLeaf } from "react-icons/fa";
import { FaCoins } from "react-icons/fa6";
import { usePoints } from "@/context/PointsContext";

const Header = () => {
	const { points } = usePoints();

	return (
		<header className="bg-gradient-to-r from-green-700 via-emerald-600 to-green-800 text-white py-4 px-6 flex justify-between items-center shadow-lg backdrop-blur-md border-b border-green-500/30">
			{/* Logo / Home Link */}
			<Link
				href="/"
				className="flex items-center gap-2 text-2xl sm:text-3xl font-bold tracking-tight hover:scale-105 transition-transform duration-300"
			>
				<FaLeaf className="text-lime-300 animate-pulse" />
				<span className="bg-gradient-to-r from-lime-200 to-emerald-100 bg-clip-text text-transparent">
					Bloom Minds
				</span>
			</Link>

			{/* Points Display */}
			<div className="flex items-center text-lg font-medium bg-green-900/30 px-4 py-2 rounded-full border border-lime-300/40 shadow-inner">
				<FaCoins className="text-yellow-400 text-2xl mr-2 drop-shadow" />
				<span className="text-lime-100 mr-2">Puntos:</span>
				<span className="font-semibold text-yellow-300">{points}</span>
			</div>
		</header>
	);
};

export default Header;
