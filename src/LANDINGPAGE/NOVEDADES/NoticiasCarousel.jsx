import React, { useState } from "react";
import { motion } from "framer-motion";

export default function NoticiasCarousel() {
  const [noticias] = useState([
    { id: 1, titulo: "Nuevo servicio", descripcion: "Vidrios templados a medida con entrega rápida." },
    { id: 2, titulo: "Ampliación", descripcion: "Abrimos una nueva sucursal en el centro." },
    { id: 3, titulo: "Promoción", descripcion: "20% de descuento en ventanales grandes." },
  ]);

  return (
    <section className="container py-5">
      {/* Título principal */}
      <motion.h2
        className="mb-5"
        style={{
          fontSize: "2.2rem",
          fontWeight: 300,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif',
          color: "#111",
          textAlign: "left",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Noticias y Promociones
      </motion.h2>

      {/* Grid de 3 cards */}
      <div className="row g-4 justify-content-center">
        {noticias.map((noticia) => (
          <motion.div
            key={noticia.id}
            className="col-12 col-md-4 shad"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="card border-0 h-100 rounded-4 shadow-lg"
              style={{ backgroundColor: "#fff" }}
            >
              <div className="card-body text-center shadow-lg p-5">
                <h5
                  className="fw-semibold mb-3"
                  style={{
                    color: "#005f73",
                    fontSize: "1.2rem",
                    fontWeight: 400,
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif',
                  }}
                >
                  {noticia.titulo}
                </h5>
                <p className="text-muted" style={{ fontSize: "1rem", lineHeight: "1.6" }}>
                  {noticia.descripcion}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
