import React from "react";
import "./siteMap.css";

const baseIcons = [
  "icon-rocket1",
  "icon-moon-o",
  "icon-sun",
  "icon-stars",
  "icon-astronomy",
  "icon-telescope",
  "icon-compass",
  "icon-map",
  "icon-location",
  "icon-sphere",
  "icon-star",
  "icon-rocket",
  "icon-global",
];

// Примітивний хелпер для позиції та розміру
const getRandomStyle = () => ({
  top: `${Math.floor(Math.random() * 95)}%`,
  left: `${Math.floor(Math.random() * 95)}%`,
  size: `${(Math.random() * 1.5 + 1.2).toFixed(2)}rem`,
});

const icons = baseIcons.flatMap((className) => [
  { className, ...getRandomStyle() },
  { className, ...getRandomStyle() },
]);

const BackgroundIcons: React.FC = () => {
  return (
    <div className="background-icons">
      {icons.map((icon, i) => (
        <i
          key={i}
          className={`bg-icon ${icon.className}`}
          style={{
            top: icon.top,
            left: icon.left,
            fontSize: icon.size,
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundIcons;
