"use client";
import React, { useEffect, useRef, useState } from "react";
import "./siteMap.css";
import { PathSVG } from "./PathSVG";
import { Point } from "./Point";
import { usePathAnimation } from "./usePathAnimation";
import { useParticles } from "./useParticles";
import BackgroundIcons from "./BackgroundIcons";

const SiteMap: React.FC = () => {
  const progressPathRef = useRef<SVGPathElement>(null);
  const highlightPathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [pathLength, setPathLength] = useState(0);
  const [halfLength, setHalfLength] = useState(0);
  const [isMiddleActive, setIsMiddleActive] = useState(false);
  const [middlePointCoords, setMiddlePointCoords] = useState({ x: 0, y: 0 });

  const { animateProgress } = usePathAnimation({
    pathLength,
    highlightPathRef,
    progressPathRef,
    containerRef,
  });

  const { containerRef: particlesRef, createParticles } = useParticles();

  useEffect(() => {
    const resizeAndInit = () => {
      if (progressPathRef.current && highlightPathRef.current) {
        const length = progressPathRef.current.getTotalLength();
        setPathLength(length);
        setHalfLength(length / 2);

        highlightPathRef.current.style.strokeDasharray = `${length}`;
        highlightPathRef.current.style.strokeDashoffset = `${length}`;
      }
    };

    resizeAndInit();
    window.addEventListener("resize", resizeAndInit);
    return () => window.removeEventListener("resize", resizeAndInit);
  }, []);

  useEffect(() => {
    if (progressPathRef.current && pathLength > 0) {
      const point = progressPathRef.current.getPointAtLength(halfLength);
      setMiddlePointCoords({ x: point.x, y: point.y });
    }
  }, [pathLength, halfLength]);

  const onStartClick = () => {
    const el = document.querySelector('[data-point="start"]') as HTMLElement;
    if (el) {
      const rect = el.getBoundingClientRect();
      createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    setIsMiddleActive(false);
    animateProgress(0, halfLength, 3000).then(() => setIsMiddleActive(true));
  };

  const onMiddleClick = () => {
    const el = document.querySelector('[data-point="middle"]') as HTMLElement;
    if (el) {
      const rect = el.getBoundingClientRect();
      createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    setIsMiddleActive(false);
    animateProgress(halfLength, pathLength, 3000);
  };

  return (
    <div ref={containerRef} className="map-container">
      <BackgroundIcons />
      <div ref={particlesRef} className="particle-layer" />
      <PathSVG
        pathLength={pathLength}
        progressPathRef={progressPathRef}
        highlightPathRef={highlightPathRef}
      />

      <Point
        top="0"
        left="6%"
        onClick={onStartClick}
        label={<>Click on me!</>}
      />

      <Point
        top={`${(middlePointCoords.y / 1800) * 100}%`}
        left={`${(middlePointCoords.x / 1000) * 100 - 3.5}%`}
        onClick={isMiddleActive ? onMiddleClick : undefined}
        label="Register"
        active={isMiddleActive}
      />

      <Point top="100%" left="91%" label="Pass tests" />
    </div>
  );
};

export default SiteMap;
