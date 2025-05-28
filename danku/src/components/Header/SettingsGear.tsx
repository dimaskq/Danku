import Link from "next/link";
import { SlSettings } from "react-icons/sl";
import "./header.css";

export function SettingsGear() {
  return (
    <div className="header__gear">
      <Link href="/about" title="About me">
        <SlSettings className="header__gear_container" />
      </Link>
    </div>
  );
}
