import React from "react";

// Estilo del contenedor principal
const legendContainerStyle = {
  position: "absolute",
  bottom: "40px",
  right: "10px",
  backgroundColor: "rgba(255, 255, 255, 0.85)",
  padding: "15px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  fontFamily: "sans-serif",
  width: "250px",
  zIndex: 1,
};

// Estilo para cada item de leyenda individual
const legendItemStyle = {
  marginBottom: "10px",
};

// Estilo para las etiquetas (igual que antes)
const labelsStyle = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "12px",
  color: "#333",
};

// Estilo para el separador entre leyendas
const dividerStyle = {
  height: "1px",
  backgroundColor: "#e0e0e0",
  margin: "15px 0",
};

// El componente ahora acepta un array `legends`
const Legend = ({ legends }) => {
  // Si el array está vacío o no existe, no renderizamos nada
  if (!legends || legends.length === 0) {
    return null;
  }

  return (
    <div style={legendContainerStyle}>
      {/* Hacemos un map sobre el array de leyendas */}
      {legends.map((legendData, index) => {
        // El estilo del gradiente se define dentro del map
        const gradientStyle = {
          height: "20px",
          borderRadius: "10px",
          background: legendData.gradient,
          marginBottom: "5px",
        };

        return (
          // Usamos un Fragment para agrupar cada leyenda y su separador
          <React.Fragment key={legendData.title}>
            <div style={legendItemStyle}>
              <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: "bold" }}>
                {legendData.title}
              </h4>
              <div style={gradientStyle} />
              <div style={labelsStyle}>
                <span>{legendData.labels[0]}</span>
                <span>{legendData.labels[1]}</span>
              </div>
            </div>
            {/* Añadimos un separador si no es el último elemento */}
            {index < legends.length - 1 && <div style={dividerStyle} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Legend;
