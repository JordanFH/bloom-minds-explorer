// src/components/Legend.jsx

import React from "react";

// Estilos para el componente. Puedes moverlos a un archivo CSS si prefieres.
const legendStyle = {
    position: "absolute",
    bottom: "40px",
    right: "10px",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    fontFamily: "sans-serif",
    width: "250px",
    zIndex: 1, // Asegura que esté sobre el mapa
};

const gradientStyle = {
    height: "20px",
    borderRadius: "10px",
    // Este gradiente representa la escala de colores típica de NDVI
    // Desde tierra/roca (marrón claro) hasta vegetación muy densa (verde oscuro)
    background: "linear-gradient(to right, #CEB595, #F2EEA6, #A9D9A2, #6BC483, #2D9C58, #006C2D)",
    marginBottom: "5px",
};

const labelsStyle = {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "#333",
};

const Legend = () => {
    return (
        <div style={legendStyle}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: "bold" }}>Índice de Vegetación (NDVI)</h4>
            <div style={gradientStyle} />
            <div style={labelsStyle}>
                <span>Menos vegetación</span>
                <span>Más vegetación</span>
            </div>
        </div>
    );
};

export default Legend;
