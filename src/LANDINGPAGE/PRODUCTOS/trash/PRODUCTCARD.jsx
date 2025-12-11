// src/LANDINGPAGE/PRODUCTSECTION/PRODUCTCARD.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductCard({ title, description, image }) {
  const [showModal, setShowModal] = useState(false);

  // small helper: set --vh for older browsers (fallback)
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    window.addEventListener("orientationchange", setVh);
    return () => {
      window.removeEventListener("resize", setVh);
      window.removeEventListener("orientationchange", setVh);
    };
  }, []);

  // bloquear scroll de fondo cuando el modal está abierto
  useEffect(() => {
    if (showModal) {
      // guardar overflow previo por si acaso
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow || "";
      };
    }
  }, [showModal]);

  return (
    <>
      <div className="col-12   col-md-12 col-lg-12 d-flex">
        <motion.div
          className="card b border shadow-lg product-card shadow animate__animated animate__fadeInUp w-100"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="image-container"
            onClick={() => setShowModal(true)}
            style={{ cursor: "pointer" }}
          >
            <img src={image} className="card-img-top" alt={title} />
            <div className="overlay" />
          </div>

          <div className="card-body border-top border-secondary d-flex flex-column">
            <h5 className="card-title text-truncate">{title}</h5>
            <p className="card-text text-truncate-multiline">{description}</p>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.img
              src={image}
              alt={title}
              className="modal-image"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              draggable={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        /* Layout tarjeta (sin cambios grandes) */
        .product-card {
          display:flex;
          flex-direction:column;
          height:100%;
          border-radius:12px;
          overflow:hidden;
          transition: box-shadow .3s ease;
          background: #fff;
        }
        .product-card:hover { box-shadow: 0 12px 24px rgba(0,0,0,0.12); }

        .image-container {
          position:relative;
          width:100%;
          aspect-ratio: 4/3;
          overflow:hidden;
          display:flex;
          align-items:center;
          justify-content:center;
        }
        .image-container img { width:100%; height:100%; object-fit:cover; display:block; }
        .overlay {
          position:absolute; inset:0;
          background: rgba(0,0,0,0.12);
          opacity:0; transition: opacity .25s;
        }
        .image-container:hover .overlay { opacity:1; }

        .card-title { font-size:1.1rem; font-weight:700; color:rgba(1, 64, 68, 1); margin:0.5rem 0 0; }
        .text-truncate-multiline {
          display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical;
          overflow:hidden; text-overflow:ellipsis; font-size:0.95rem;
        }

        /* ---------- FIX modal backdrop para mobile ---------- */
        :root { --vh: 1vh; } /* fallback */
        .modal-backdrop {
          position: fixed;
          inset: 0; /* top:0; right:0; bottom:0; left:0; */
          /* Preferimos 100dvh (browser moderno) con fallback a variable --vh */
          height: max(100dvh, calc(var(--vh, 1vh) * 100));
          width: 100%;
          display:flex;
          align-items:center;
          justify-content:center;
          background: rgba(0,0,0,0.88);
          z-index: 9999;
          -webkit-overflow-scrolling: touch;
          touch-action: manipulation;
        }
          
        /* Fondo general: verde agua light (sólo aquí) */
        .product-card{ background: linear-gradient(180deg,#e8fff9,#cff6ee); overflow:hidden; border: none; }


        .modal-image {
          max-width: 92%;
          max-height: 92%;
          border-radius: 12px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.6);
          user-select: none;
          -webkit-user-drag: none;
        }

        @media (max-width: 768px) {
          .image-container { aspect-ratio: 3/2; }
          .card-title { font-size: 1rem; }
          .modal-backdrop { padding: 12px; }
          .modal-image { border-radius: 10px; }
        }
      `}</style>
    </>
  );
}
