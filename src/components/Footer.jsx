const Footer = () => (
	<footer className="bg-gradient-to-r from-green-800 via-emerald-700 to-green-900 text-lime-100 py-8 px-6 text-center border-t border-lime-400/30 shadow-inner">
		<p className="text-sm sm:text-base">
			🌿 Developed with passion by the{" "}
			<span className="font-semibold text-lime-300">Bloom Minds 💚</span> team • NASA
			Space Apps Challenge 2025 🌿
		</p>
		<p className="mt-2 text-xs text-emerald-200/80">
			Data based on Earth observations and satellites 🌎 — Inspiring the
			connection between science and nature.
		</p>
		<p className="mt-4 text-xs text-emerald-300/70">
			&copy; {new Date().getFullYear()} Bloom Minds. All rights
			reserved.
		</p>
	</footer>
);

export default Footer;