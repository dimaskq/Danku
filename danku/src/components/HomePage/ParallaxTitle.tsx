"use client";

import { useEffect, useState } from "react";

export const ParallaxTitle = () => {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY * 0.2);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <h1
      className="welcome__bg"
      style={{
        transform: `translateY(${offsetY}px)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      Study
    </h1>
  );
};
