"use client";

import Image from "next/image";
import Link from "next/link";

export default function SubjectCard({ subject }) {
	const normalize = (str) =>
		str
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "") // quita tildes
			.replace(/\s+/g, "-") // espacios a guiones
			.replace(/[()]/g, ""); // quita paréntesis

	const slug = normalize(subject.name);

	return (
		<Link
			href={`/quiz/${slug}`}
			className="group bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 border border-green-200"
		>
			<div className="relative w-full h-48">
				<Image
					src={subject.image}
					alt={subject.name}
					fill
					className="object-cover"
				/>
			</div>
			<div className="p-4">
				<h2 className="text-xl font-semibold text-green-700 group-hover:text-green-500 transition-colors">
					{subject.name}
				</h2>
			</div>
		</Link>
	);
}
