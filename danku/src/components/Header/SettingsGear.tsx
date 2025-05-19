import { SlSettings } from "react-icons/sl";
import "./header.css";

export function SettingsGear() {
  return (
    <div className="header__gear">
      <SlSettings className="header__gear_container" title="About me" />
    </div>
  );
}
