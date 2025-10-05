const Footer = () => (
	<footer className="bg-gradient-to-r from-green-800 via-emerald-700 to-green-900 text-lime-100 py-8 px-6 text-center border-t border-lime-400/30 shadow-inner">
		<p className="text-sm sm:text-base">
			🌿 Desarrollado con pasión por el equipo{" "}
			<span className="font-semibold text-lime-300">Bloom Minds 💚</span> • NASA
			Space Apps Challenge 2025 🌿
		</p>
		<p className="mt-2 text-xs text-emerald-200/80">
			Datos basados en observaciones de la Tierra y satélites 🌎 — Inspirando la
			conexión entre la ciencia y la naturaleza.
		</p>
		<p className="mt-4 text-xs text-emerald-300/70">
			&copy; {new Date().getFullYear()} Bloom Minds. Todos los derechos
			reservados.
		</p>
	</footer>
);

export default Footer;
