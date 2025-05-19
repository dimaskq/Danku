"use client";

import { Logo } from "./Logo";
import { BurgerMenu } from "./BurgerMenu";
import { SettingsGear } from "./SettingsGear";
import "./header.css";

export function Header() {
  return (
    <header className="header">
      <Logo />
      <BurgerMenu />
      <SettingsGear />
    </header>
  );
}
