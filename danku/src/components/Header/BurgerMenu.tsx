import { Slant as Hamburger } from "hamburger-react";
import { useState } from "react";
import "./header.css";

interface DominoLinkProps {
  href: string;
  text: string;
}

export const DominoLink: React.FC<DominoLinkProps> = ({ href, text }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      className="domino-link"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {text.split("").map((char, i) => {
        const delay = hovered
          ? `${i * 70}ms`
          : `${(text.length - 1 - i) * 70}ms`;

        return (
          <span
            key={i}
            className={hovered ? "fall" : "rise"}
            style={{ transitionDelay: delay }}
          >
            {char}
          </span>
        );
      })}
    </a>
  );
};

export function BurgerMenu() {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <div className={`burger-menu ${isOpen ? "open" : ""}`}>
        <Hamburger
          toggled={isOpen}
          toggle={setOpen}
          direction="right"
          duration={0.7}
          size={40}
        />
      </div>

      <div className={`fullscreen-menu ${isOpen ? "open" : ""}`}>
        <ul>
          <li>
            <DominoLink href="/tests" text="Tests" />
          </li>
          <li>
            <DominoLink href="/profile" text="Profile" />
          </li>
        </ul>
      </div>

      {isOpen && <div className="backdrop" onClick={() => setOpen(false)} />}
    </>
  );
}
