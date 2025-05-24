import React from "react";
import { ReactNode } from "react";
interface PointProps {
  top: string;
  left: string;
  label: ReactNode;
  onClick?: () => void;
  active?: boolean;
}

export const Point: React.FC<PointProps> = ({
  top,
  left,
  label,
  onClick,
  active = true,
}) => {
  return (
    <div
      className="point"
      style={{
        top,
        left,
        pointerEvents: active ? "auto" : "none",
      }}
      onClick={onClick}
    >
      <button className={`pushable ${!active ? "disabled" : ""}`}>
        <span className="front">{label}</span>
      </button>
    </div>
  );
};
