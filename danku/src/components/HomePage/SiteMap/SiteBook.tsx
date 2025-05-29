import React from "react";
import Head from "next/head";
import Script from "next/script";

import "./siteBook.css";

const SiteBook: React.FC = () => {
  return (
    <>
      <Head>
        <link
          href="/css/book-project-css.webflow.css"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="https://daks2k3a4ib2z.cloudfront.net/img/favicon.ico"
          rel="shortcut icon"
          type="image/x-icon"
        />
        <link
          href="https://daks2k3a4ib2z.cloudfront.net/img/webclip.png"
          rel="apple-touch-icon"
        />
      </Head>
      <div className="scene">
        <div className="book-wrap">
          <div className="left-side">
            <div className="book-cover-left"></div>
            <div className="layer1">
              <div className="page-left"></div>
            </div>
            <div className="layer2">
              <div className="page-left"></div>
            </div>
            <div className="layer3">
              <div className="page-left"></div>
            </div>
            <div className="layer4">
              <div className="page-left"></div>
            </div>
            <div className="layer-text">
              <div className="page-left-2">
                <div className="corner"></div>
                <div className="corner2"></div>
                <div className="corner-fold"></div>
                <div className="page-text w-richtext">
                  <h3 className="book__title">
                    <strong>Rerister</strong>
                  </h3>
                  <h6 className="book__link">
                    Click{" "}
                    <a
                      href="/register"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      HERE
                    </a>
                  </h6>
                  <p>Danku — це платформа для навчання для кожного.</p>
                  <p>Тут ти проходиш тести, щоб визначити свій рівень знань.</p>
                  <p>
                    За результатами ти навчаєшся саме тому, чого ще не знаєш —
                    це і є твоє персональне, ефективне навчання.
                  </p>
                  <p>Щоб почати, потрібно зареєструватися.</p>
                  <p>Просто, розумно, для тебе.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="center"></div>
          <div className="right-side">
            <div className="book-cover-right"></div>
            <div className="layer1">
              <div className="page-right"></div>
            </div>
            <div className="layer2 right">
              <div className="page-right"></div>
            </div>
            <div className="layer3 right">
              <div className="page-right"></div>
            </div>
            <div className="layer4 right">
              <div className="page-right"></div>
            </div>
            <div className="layer-text right">
              <div className="page-right-2">
                <div className="page-text w-richtext">
                  <h3 className="book__title">
                    <strong>Tests</strong>
                  </h3>
                  <h6 className="book__link">
                    Click{" "}
                    <a href="/tests" target="_blank" rel="noopener noreferrer">
                      HERE
                    </a>
                  </h6>
                  <p>
                    Тут представлені тести з математики та англійської мови.
                  </p>
                  <p>
                    З англійської мови — рівні від A1 до C2, відповідно до
                    міжнародної шкали.
                  </p>
                  <p>‍</p>
                  <p>З математики — для учнів з 1 по 11 клас.</p>
                  <p>‍</p>
                  <p>
                    Усі тести мають одну правильну відповідь у кожному
                    запитанні.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Script
        src="https://code.jquery.com/jquery-3.3.1.min.js"
        integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
        strategy="beforeInteractive"
      />
      <Script src="/js/webflow.js" strategy="afterInteractive" />
      <Script
        src="https://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js"
        strategy="afterInteractive"
      />
      <Script id="webfont-loader" strategy="afterInteractive">
        {`WebFont.load({
          google: {
            families: ["PT Sans:400,400italic,700,700italic"]
          }
        });`}
      </Script>
      <Script id="touch-detection" strategy="afterInteractive">
        {`!(function (o, c) {
          var n = c.documentElement,
            t = " w-mod-";
          n.className += t + "js";
          if ("ontouchstart" in o || (o.DocumentTouch && c instanceof DocumentTouch)) {
            n.className += t + "touch";
          }
        })(window, document);`}
      </Script>
      {process.browser && (
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/placeholders/3.0.2/placeholders.min.js"
          strategy="afterInteractive"
        />
      )}
      {process.browser && (
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js"
          strategy="afterInteractive"
        />
      )}
    </>
  );
};

export default SiteBook;
