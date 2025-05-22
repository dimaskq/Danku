"use client";
import "./homePage.css";
import { ParallaxTitle } from "./ParallaxTitle";
const Welcome: React.FC = () => {
  return (
    <div className="welcome">
      <ParallaxTitle />
      <div className="welcome__content">
        <h2 className="welcome__text">
          <span>
            Welcome to Danku
            <div className="welcome__text_smile">
              <img src="/images/smile.png" alt="smile" />,
            </div>
          </span>

          <span className="welcome__line">
            <span className="welcome__highlight">Your</span>
            <span className="welcome__desc-inline">
              <img
                className="welcome__desc_arrow welcome__desc_arrowTop"
                src="/icons/arrow.svg"
                alt="image of arrow"
              />
              <img
                className="welcome__desc_arrow welcome__desc_arrowBottom"
                src="/icons/arrow.svg"
                alt="image of arrow"
              />
              <div>(</div> Hi! I’m Kravchenko Dmytro, <br />
              Fullstack Developer from Ukraine.<div>)</div>
            </span>
          </span>

          <span>guru in tests</span>
        </h2>
      </div>
    </div>
  );
};

export default Welcome;
