// useParticles.ts
import { useRef } from "react";

export const useParticles = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const createParticles = (x: number, y: number, count = 10) => {
    if (!containerRef.current) return;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";

      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * 40 + 20;

      const dx = Math.cos(angle) * radius;
      const dy = Math.sin(angle) * radius;

      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.setProperty("--x", `${dx}px`);
      particle.style.setProperty("--y", `${dy}px`);

      containerRef.current.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 700);
    }
  };

  return { containerRef, createParticles };
};
