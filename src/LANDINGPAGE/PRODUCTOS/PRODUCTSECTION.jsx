import React, { useMemo, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import products from "./productsData";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductSection.css";

export default function ProductSection() {
  const [openItem, setOpenItem] = useState(null);

  // noticias locales
  const newsData = [
    {
      id: "n1",
      title: "Promoción de Invierno",
      short: "15% OFF en mamparas por tiempo limitado.",
      image: "https://images.unsplash.com/photo-1582719478175-5531d24a6e9d?q=80&w=1200&auto=format&fit=crop",
      cta: "Aprovechar"
    },
    {
      id: "n2",
      title: "Nuevo perfil minimal",
      short: "Perfil oculto para ventanales panorámicos.",
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200&auto=format&fit=crop",
      cta: "Ver más"
    },
    {
      id: "n3",
      title: "Instalación express",
      short: "Turnos en 72 horas para urgencias de obra.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
      cta: "Reservar"
    }
  ];

  const handleOpen = useCallback((item) => setOpenItem(item), []);
  const handleClose = useCallback(() => setOpenItem(null), []);

  return (
    <section className="ps-container container py-5">

      {/* ---------- Novedades ---------- */}
      <h2 className="mb-4 section-title">✨ Novedades</h2>
      <div className="row g-4 mb-5">
        {newsData.map((n) => (
          <div className="col-md-4" key={n.id}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="news-card shadow-sm"
            >
              <img src={n.image} alt={n.title} className="news-img" />
              <div className="p-3">
                <h5>{n.title}</h5>
                <p>{n.short}</p>
                <button className="btn btn-outline-dark btn-sm">{n.cta}</button>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      <hr className="soft-divider" />

      {/* ---------- Layout inferior: izquierda quienes somos / derecha productos ---------- */}
      <div className="row pt-5">

        {/* LEFT - QUIENES SOMOS */}
        <div className="col-lg-4 pe-lg-5">
          <div className="about-box shadow-sm p-4 rounded">

            <div className="about-icon mb-3">
              🏛️
            </div>

            <h3 className="mb-3">Quiénes somos</h3>

            <p className="text-muted">
              Somos <strong>VidrieríaFlash</strong>, especialistas en instalaciones de vidrio a medida
              para arquitectura moderna, obra y diseño interior.  
              Nuestro compromiso: precisión, estética y plazos reales.
            </p>

            <ul className="ps-0 mt-4 about-list">
              <li>📌 Instalación garantizada</li>
              <li>📌 Materiales premium</li>
              <li>📌 Asesoría técnica</li>
              <li>📌 Respuesta en 24hs</li>
            </ul>

            <button className="btn btn-dark w-100 mt-4">📩 Pedir presupuesto</button>
          </div>
        </div>

        {/* RIGHT - PRODUCTOS */}
        <div className="col-lg-8 mt-5 mt-lg-0">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h3>Productos</h3>
          </div>

          <div className="row g-4">
            {products.map((item) => (
              <div className="col-md-6" key={item.id}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="product-card shadow-sm"
                >
                  <button className="product-img-btn" onClick={() => handleOpen(item)}>
                    <img src={item.image} alt={item.title} className="product-img" />
                  </button>
                  <div className="p-3">
                    <h5>{item.title}</h5>
                    <p className="text-muted small">{item.description}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {openItem && (
          <motion.div className="modal-backdrop" onClick={handleClose}>
            <motion.div
              className="modal-content-custom"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={openItem.image} alt={openItem.title} className="modal-img" />
              <h4 className="mt-3">{openItem.title}</h4>
              <p className="text-muted">{openItem.description}</p>
              <button className="btn btn-dark mt-3" onClick={handleClose}>Cerrar</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
