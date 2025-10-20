// src/components/NoticiasCarousel.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./noticias.css"

export default function NoticiasCarousel() {
  const [noticias, setNoticias] = useState([

  ]);

  const backendUrl = "http://localhost:4000/anuncios";

  useEffect(() => {
    // función para cargar noticias (la podemos reutilizar)
    const cargarNoticias = () => {
      fetch(backendUrl)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setNoticias(data);
        })
    };

    // Ejecutar una vez al renderizar (montaje)
    cargarNoticias();

    // Luego cada 60 segundos
    const intervalo = setInterval(cargarNoticias, 60000);

    // Limpiar intervalo al desmontar
    return () => clearInterval(intervalo);
  }, []);


  // Paleta / degradados (puedes cambiar colores fácil)
  const gradients = [
    "linear-gradient(135deg,#DFFBF2 0%,#BFF6E6 50%,#7FEAD4 100%)",
    "linear-gradient(135deg,#FFF5D9 0%,#FFD6A5 50%,#FFB6A3 100%)",
    "linear-gradient(135deg,#EAF2FF 0%,#C9DEFF 50%,#9FB8FF 100%)",
    "linear-gradient(135deg,#FCE8FF 0%,#F6C7FF 50%,#E8A7FF 100%)",
  ];

  return (
    <section className="container py-5">
      <motion.h2
        className="mb-5"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          fontSize: "2.1rem",
          fontWeight: 400,
          color: "#0b2b26",
          fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial',
        }}
      >
        Noticias y Promociones
      </motion.h2>

      <div className="row g-4">
        {noticias.map((noticia, i) => {
          const bg = gradients[i % gradients.length];
          return (
            <div key={noticia.id} className="col-12 col-md-6 col-lg-4">
              <motion.article
                className="news-card p-0 rounded-4 shadow-sm h-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                style={{ background: bg }}
                aria-labelledby={`news-${noticia.id}`}
              >
                {/* Blobs / detalles animados */}
                <div className="decor">
                  <span className="blob b1" />
                  <span className="blob b2" />
                </div>

                {/* Rayo / sheen */}
                <div className="ray" aria-hidden />

                {/* Contenido (sección interior con blur y separación visual) */}
                <div className="card-body d-flex flex-column p-4" style={{ backdropFilter: "blur(6px)" }}>
                  <h3 id={`news-${noticia.id}`} className="h5 mb-2 fw-bold text-dark">
                    {noticia.titulo}
                  </h3>

                  <p className="mb-3 text-muted small" style={{ lineHeight: 1.5 }}>
                    {noticia.descripcion}
                  </p>

                </div>
              </motion.article>
            </div>
          );
        })}
      </div>

    </section>
  );
}
