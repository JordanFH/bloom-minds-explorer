"use client";

const StarryBackground = () => {
  // Generate random stars
  const generateStars = (count) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      cx: Math.round(Math.random() * 10000) / 100,
      cy: Math.round(Math.random() * 10000) / 100,
      r: Math.round((Math.random() + 0.5) * 10) / 10,
    }));
  };

  const stars = generateStars(200);

  return (
    <div className="stars-wrapper">
      {/* Three layers of twinkling stars */}
      {[0, 1, 2].map((layer) => (
        <svg
          key={layer}
          className={`stars layer-${layer}`}
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          role="img"
          aria-label="Decorative starry background layer"
        >
          <title>Stars layer {layer}</title>
          {stars.map((star) => (
            <circle
              key={`${layer}-${star.id}`}
              className="star"
              cx={`${star.cx}%`}
              cy={`${star.cy}%`}
              r={star.r}
            />
          ))}
        </svg>
      ))}

      {/* Comets */}
      <svg
        className="extras"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        role="img"
        aria-label="Decorative comets background"
      >
        <title>Comets animation</title>
        <defs>
          <radialGradient id="comet-gradient" cx="0" cy=".5" r="0.5">
            <stop offset="0%" stopColor="rgba(255,255,255,.8)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <g transform="rotate(-135)">
          <ellipse
            className="comet comet-a"
            fill="url(#comet-gradient)"
            cx="0"
            cy="0"
            rx="150"
            ry="2"
          />
        </g>
        <g transform="rotate(20)">
          <ellipse
            className="comet comet-b"
            fill="url(#comet-gradient)"
            cx="100%"
            cy="0"
            rx="150"
            ry="2"
          />
        </g>
        <g transform="rotate(300)">
          <ellipse
            className="comet comet-c"
            fill="url(#comet-gradient)"
            cx="40%"
            cy="100%"
            rx="150"
            ry="2"
          />
        </g>
      </svg>
    </div>
  );
};

export default StarryBackground;
