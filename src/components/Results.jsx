"use client";

import { useEffect, useState } from "react";
import { FaTrophy, FaCheckCircle, FaTimesCircle, FaQuestionCircle, FaPercentage, FaClock, FaStopwatch } from "react-icons/fa";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const Results = ({
  score,
  totalQuestions,
  correctAnswers,
  wrongAnswers,
  unattemptedQuestions,
  percentage,
  timeSpent,
  averageTimePerQuestion,
}) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const { width, height } = useWindowSize();

  // 🌿 Plant emojis para reemplazar el confeti
  const plantEmojis = ["🌱", "🌿", "🍃", "🌸", "🌻", "🌼"];

  // 🌧️ Generar piezas de confeti personalizadas
  const pieces = Array.from({ length: 120 }).map(() => ({
    emoji: plantEmojis[Math.floor(Math.random() * plantEmojis.length)],
    x: Math.random() * width,
    y: Math.random() * -height, // empieza desde arriba
    r: Math.random() * 360,
    speed: 2 + Math.random() * 3, // velocidad más rápida
  }));

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center relative overflow-hidden">
      {/* 🌿 Plant Confetti */}
      {showConfetti &&
        pieces.map((piece, index) => (
          <span
            key={index}
            style={{
              position: "absolute",
              top: `${piece.y}px`,
              left: `${piece.x}px`,
              fontSize: "1.5rem",
              animation: `fall ${3 + Math.random() * 3}s linear infinite`,
              transform: `rotate(${piece.r}deg)`,
            }}
          >
            {piece.emoji}
          </span>
        ))}

      {/* 🔽 Animación de caída */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>

      <h2 className="text-3xl font-bold mb-6 text-center text-green-700">
        🌸 Resultados del Quiz 🌿
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* Total Points */}
        <div className="p-5 bg-white shadow-md rounded-lg flex items-center justify-between hover:shadow-lg transition">
          <div>
            <p className="text-xl font-semibold">Puntos Totales</p>
            <p className="text-lg font-bold text-green-600">{score}</p>
          </div>
          <FaTrophy className="text-yellow-500 text-3xl" />
        </div>

        {/* Correct Answers */}
        <div className="p-5 bg-white shadow-md rounded-lg flex items-center justify-between hover:shadow-lg transition">
          <div>
            <p className="text-xl font-semibold">Respuestas Correctas</p>
            <p className="text-lg font-bold text-green-600">{correctAnswers}</p>
          </div>
          <FaCheckCircle className="text-green-500 text-3xl" />
        </div>

        {/* Wrong Answers */}
        <div className="p-5 bg-white shadow-md rounded-lg flex items-center justify-between hover:shadow-lg transition">
          <div>
            <p className="text-xl font-semibold">Respuestas Incorrectas</p>
            <p className="text-lg font-bold text-red-600">{wrongAnswers}</p>
          </div>
          <FaTimesCircle className="text-red-500 text-3xl" />
        </div>

        {/* Unattempted */}
        <div className="p-5 bg-white shadow-md rounded-lg flex items-center justify-between hover:shadow-lg transition">
          <div>
            <p className="text-xl font-semibold">No Respondidas</p>
            <p className="text-lg font-bold text-yellow-600">{unattemptedQuestions}</p>
          </div>
          <FaQuestionCircle className="text-yellow-500 text-3xl" />
        </div>

        {/* Porcentaje */}
        <div className="p-5 bg-white shadow-md rounded-lg flex items-center justify-between hover:shadow-lg transition">
          <div>
            <p className="text-xl font-semibold">Porcentaje</p>
            <p className="text-lg font-bold text-blue-600">{percentage}%</p>
          </div>
          <FaPercentage className="text-blue-500 text-3xl" />
        </div>

        {/* Tiempo total */}
        <div className="p-5 bg-white shadow-md rounded-lg flex items-center justify-between hover:shadow-lg transition">
          <div>
            <p className="text-xl font-semibold">Tiempo Total</p>
            <p className="text-lg font-bold text-purple-600">{timeSpent.toFixed(2)}s</p>
          </div>
          <FaClock className="text-purple-500 text-3xl" />
        </div>

        {/* Promedio */}
        <div className="p-5 bg-white shadow-md rounded-lg flex items-center justify-between hover:shadow-lg transition">
          <div>
            <p className="text-xl font-semibold">Promedio por Pregunta</p>
            <p className="text-lg font-bold text-indigo-600">{averageTimePerQuestion}s</p>
          </div>
          <FaStopwatch className="text-indigo-500 text-3xl" />
        </div>
      </div>

      <div className="mt-8 text-lg font-semibold text-green-700">
        🌿 ¡Obtuviste {correctAnswers * 4} de {totalQuestions * 4} puntos! 🌼
      </div>
    </div>
  );
};

export default Results;
