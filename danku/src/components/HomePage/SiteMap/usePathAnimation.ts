import { RefObject, useRef } from "react";

interface UsePathAnimationProps {
  pathLength: number;
  progressPathRef: React.RefObject<SVGPathElement | null>;
  highlightPathRef: React.RefObject<SVGPathElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const usePathAnimation = ({
  pathLength,
  highlightPathRef,
  progressPathRef,
  containerRef,
}: UsePathAnimationProps) => {
  const animationRef = useRef<number | null>(null);

  const animateProgress = (
    from: number,
    to: number,
    duration = 4000
  ): Promise<void> => {
    return new Promise((resolve) => {
      let start: number | null = null;

      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const currentOffset = from + (to - from) * progress;

        if (highlightPathRef.current) {
          highlightPathRef.current.style.strokeDashoffset = `${
            pathLength - currentOffset
          }`;
        }

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(step);
        } else {
          resolve();
        }
      };

      animationRef.current = requestAnimationFrame(step);
    });
  };

  return { animateProgress };
};
