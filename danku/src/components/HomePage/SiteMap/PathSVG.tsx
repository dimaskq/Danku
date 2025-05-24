import React, { RefObject } from "react";

interface PathSVGProps {
  pathLength: number;
  progressPathRef: React.RefObject<SVGPathElement | null>;
  highlightPathRef: React.RefObject<SVGPathElement | null>;
}

export const PathSVG: React.FC<PathSVGProps> = ({
  pathLength,
  progressPathRef,
  highlightPathRef,
}) => {
  const d = `
    M100,0
    C 100,200 700,100 700,400
    C 700,700 200,600 200,900
    C 200,1200 800,1100 800,1400
    C 800,1600 300,1600 900,1800
  `;

  return (
    <svg viewBox="0 0 1000 1800" preserveAspectRatio="xMidYMin slice">
      <path
        ref={progressPathRef}
        d={d}
        stroke="#ddd"
        fill="none"
        strokeWidth={5}
      />
      <path
        ref={highlightPathRef}
        d={d}
        stroke="#f89797"
        fill="none"
        strokeWidth={5}
        style={{
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
          transition: "stroke-dashoffset 0.2s linear",
        }}
      />
    </svg>
  );
};
