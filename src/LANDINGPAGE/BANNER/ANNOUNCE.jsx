import React from "react";
import { motion } from "framer-motion";
import "./BannerSVG.css";
import { useNavigate } from "react-router-dom";

export default function BannerVF(){
  const navigate = useNavigate();

  return (
    <section className="vf-banner " aria-label="Banner VidrieriaFlash">
      

      <div className="vf-content">
        <motion.h2 className="vf-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          VidrieriaFlash
        </motion.h2>
        <motion.p className="vf-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          Vidrios y ventanales a medida — rápida entrega y colocación profesional.
        </motion.p>
        <motion.a className="vf-cta"  onClick={() => navigate("/contactanos")} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          Pedir presupuesto
        </motion.a>
      </div>
    </section>
  );
}
