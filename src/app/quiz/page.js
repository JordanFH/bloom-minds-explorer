'use client';

import SubjectCard from "@/components/SubjectCard";
import { useEffect, useState } from "react";

export default function Home() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const response = await fetch('/data/questions.json');
      if (response.ok) {
        const data = await response.json();
        setSubjects(data.subjects);
      } else {
        console.error("Failed to fetch subjects");
      }
    };
    fetchSubjects();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-green-50 via-emerald-100 to-green-200">

      {/* Fondo decorativo tipo naturaleza */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30 bg-[url('/images/leaf-pattern.png')] bg-cover bg-center"></div>

      {/* Contenido principal */}
      <div className="relative z-10 text-center max-w-4xl px-6 py-10">
        <h1 className="text-5xl font-bold text-green-800 mb-4 animate-fadeIn">
          🌸 Bloom Minds 🌸
        </h1>
        <p className="text-lg text-green-700 mb-8 animate-fadeIn delay-100">
          Explora, aprende y florece. Descubre cómo la Tierra vive y respira a través de sus ciclos de floración.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {subjects.length > 0 ? (
            subjects.map((subject) => (
              <div key={subject.name} className="transform hover:scale-105 transition duration-300 ease-out">
                <SubjectCard subject={subject} />
              </div>
            ))
          ) : (
            <p className="text-lg text-green-600 animate-pulse">🌿 Cargando módulos de exploración...</p>
          )}
        </div>
      </div>
    </div>
  );
}
