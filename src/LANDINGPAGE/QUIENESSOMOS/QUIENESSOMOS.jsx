import React from "react";
import { motion } from "framer-motion";

export default function QuienesSomos() {
  return (
    <section className="d-flex justify-content-center align-items-stretch py-5 px-3 gap-4 flex-wrap">
      {/* Cuadro izquierdo */}
      <motion.div
        className="d-flex flex-fill justify-content-center align-items-center rounded-4 shadow-lg p-5"
        style={{ minWidth: "300px", maxWidth: "450px", backgroundColor: "#A7E8F1" }}
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="m-0 text-center fw-bold" style={{ color: "#004D66", fontSize: "1.8rem" }}>
          Quiénes Somos
        </h2>
      </motion.div>

      {/* Cuadro derecho */}
      <motion.div
        className="d-flex flex-fill flex-column justify-content-center rounded-4 shadow-lg p-5"
        style={{ minWidth: "300px", maxWidth: "450px", backgroundColor: "#FFFFFF" }}
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <p className="m-0 text-center" style={{ color: "#333333", fontSize: "1rem", lineHeight: "1.6" }}>
          Somos VidrieríaFlash, especialistas en vidrios y ventanales a medida.  
          Combinamos rapidez, precisión y profesionalismo para entregar soluciones  
          de alta calidad a nuestros clientes. Nuestra pasión es brindar elegancia  
          y funcionalidad en cada proyecto.
        </p>
      </motion.div>
    </section>
  );
}
