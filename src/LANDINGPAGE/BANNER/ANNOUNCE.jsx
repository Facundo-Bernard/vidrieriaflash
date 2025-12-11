import React from "react";
import "./BannerSVG.css";

export default function BannerVF() {
  return (
    <header className="vf-hero">
      <div className="vf-overlay"></div>

      <div className="vf-content">
        <h1 className="vf-title fade">
          Vidriería <span>FLASH</span>
        </h1>

        <p className="vf-sub fade delay">
          Diseño moderno en vidrio, cerramientos y arquitectura transparente.
        </p>

        <div className="vf-actions fade delay2">
          <button className="vf-btn primary">Ver productos</button>
          <button className="vf-btn ghost">Ver trabajos</button>
        </div>
      </div>
    </header>
  );
}
