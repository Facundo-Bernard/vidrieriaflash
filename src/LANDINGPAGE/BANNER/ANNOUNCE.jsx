import React from "react";
import "./BannerSVG.css";

export default function BannerVF() {
  return (
    <header className="vf-hero">
      <div className="vf-overlay"></div>

      <div className="vf-content">
        <h1 className="vf-title fade">
          Cristales <span>FLASH</span>
        </h1>

        <p className="vf-sub fade delay">
          Instalacion y diseño en vidrio, cerramientos y arquitectura transparente.
        </p>

        <div className="vf-actions fade delay2">
          <div className="vf-actions fade delay2">
            <button
              className="vf-btn primary"
              onClick={() => {
                const el = document.getElementById("productos");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Ver productos
            </button>

          </div>

        </div>





      </div>
    </header>
  );
}
