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
      <h2 className="mb-4 section-title"> Novedades</h2>
      <div className="row g-4 mb-5">
        {newsData.map((n) => (
          <div className="col-md-4 " key={n.id}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="news-card"
              style={{
                background: "#fff",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 0 20px rgba(0, 0, 0, 0.31)"
              }}
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
          <div
    className="about-box shadow-lg p-5 rounded-4"
    style={{
      background: "linear-gradient(195deg, #1abbaea8, #e9faffaa)",
      backdropFilter: "blur(6px)",
      border: "1px solid #ffffff66",
      maxWidth: "520px",
    }}
  >
    {/* ICONO + TÍTULO */}
    <div className="d-flex align-items-center justify-content-center mb-4">
      <div
        style={{
          fontSize: "40px",
          marginRight: "12px",
        }}
      >
        
      </div>
      <h2 className="fw-bold m-0" style={{ fontSize: "2rem" }}>
        ¿Quiénes somos?
      </h2>
    </div>

    {/* DESCRIPCIÓN */}
    <p className="text-muted text-center fs-5" style={{ lineHeight: "1.6" }}>
      En <strong>Cristales Flash</strong> realizamos instalaciones de vidrio a
      medida para arquitectura moderna, hogares y proyectos de diseño.
      <br />
      Nuestro foco: <strong>precisión</strong>, <strong>estética</strong> y
      <strong> cumplimiento real de plazos</strong>.
    </p>


  </div>
        </div>

        {/* RIGHT - PRODUCTOS */}
        <div className="col-lg-8 ">
          <div className="d-flex align-items-center justify-content-between mb-">
            <h3 id="productos">Productos</h3>
          </div>

          <div className="row g-4">
            {products.map((item) => (
              <div className="col-md-6 " key={item.id}
              style={{
                background: "#fff",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 0 20px rgba(0, 0, 0, 0.31)"
              }}>
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
