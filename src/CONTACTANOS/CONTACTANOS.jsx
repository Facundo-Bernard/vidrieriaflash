import { useState, useEffect, useMemo, useRef } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import "./ContactoForm.css"; // <-- estilos separados
import UBICACIONCOOP from "./ubicacioncoop/UBICACIONCOOP";


const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const STORAGE_DRAFT_KEY = "contactoFormDraft_v2";
const STORAGE_LIMIT_KEY = "enviosRestantes";

const initialForm = { nombre: "", telefono: "", email: "", mensaje: "", sitio: "" };
const validators = {
  nombre: (v) => v.trim().length >= 3,
  telefono: (v) => /^[+\d][\d\s().\-]{6,}$/.test(v.trim()),
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
  mensaje: (v) => v.trim().length >= 10 && v.trim().length <= 1200,
  sitio: (v) => v.trim().length === 0,
};

export default function ContactoForm() {
  const [formData, setFormData] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);
  const [enviosRestantes, setEnviosRestantes] = useState(3);
  const [charCount, setCharCount] = useState(0);
  const statusRef = useRef(null);

  useEffect(() => {
    const storedLimit = localStorage.getItem(STORAGE_LIMIT_KEY);
    if (storedLimit) setEnviosRestantes(parseInt(storedLimit, 10));
    const draftRaw = localStorage.getItem(STORAGE_DRAFT_KEY);
    if (draftRaw) {
      try {
        const draft = JSON.parse(draftRaw);
        setFormData({ ...initialForm, ...draft, sitio: "" });
        setCharCount((draft.mensaje || "").length);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const { sitio, ...draft } = formData;
    localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(draft));
  }, [formData]);

  const errors = useMemo(() => {
    const e = {};
    for (const k of Object.keys(validators)) if (!validators[k](formData[k] || "")) e[k] = true;
    return e;
  }, [formData]);

  const isValid = useMemo(() => {
    return ["nombre", "telefono", "email", "mensaje"].every((k) => validators[k](formData[k] || ""));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "mensaje") setCharCount(value.length);
  };
  const handleBlur = (e) => setTouched((prev) => ({ ...prev, [e.target.name]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (enviosRestantes <= 0) { setStatus("limit"); scrollToStatus(); return; }
    if (!isValid) { setTouched(Object.keys(initialForm).reduce((a,k)=>(a[k]=true,a),{})); return; }
    if (formData.sitio && formData.sitio.trim()) { setStatus("error"); scrollToStatus(); return; }

    try {
      setSending(true);
      const payload = { ...formData, submittedAt: new Date().toISOString(), userAgent: navigator.userAgent };
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        payload,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setStatus("success"); setFormData(initialForm); setCharCount(0);
      localStorage.removeItem(STORAGE_DRAFT_KEY);
      const nuevo = enviosRestantes - 1;
      setEnviosRestantes(nuevo); localStorage.setItem(STORAGE_LIMIT_KEY, String(nuevo));
    } catch { setStatus("error"); } finally { setSending(false); scrollToStatus(); }
  };

  const scrollToStatus = () => {
    requestAnimationFrame(() => { if (statusRef.current) statusRef.current.scrollIntoView({ behavior: "smooth", block: "center" }); });
  };

  return (
    <div>
        <div className="container mt-5 mb-4">
          <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-5 text-center">
            <h1 className="contacto-title">Contáctanos</h1>
            <p className="text-muted mb-0">Estamos para ayudarte</p>
          </motion.div>

          <div className="row g-4 align-items-start ">
            {/* Formulario */}
            <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="  col-12 col-lg-6">
              <div className="card rounded-4 border-0 contacto-card"
               style={{
                background: "#4ed1c052",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 0 20px rgba(0, 0, 0, 0.31)"
              }}>
                <div className="card-body p-4">
                  <div ref={statusRef} aria-live="polite" aria-atomic="true" className="mb-3">
                    {status === "success" && <div className="alert alert-success rounded-3">Mensaje enviado con éxito. ¡Gracias!</div>}
                    {status === "error" && <div className="alert alert-danger rounded-3">Ocurrió un error. Intentá nuevamente.</div>}
                    {status === "limit" && <div className="alert alert-warning rounded-3">Límite de envíos por sesión alcanzado.</div>}
                  </div>
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Nombre *</label>
                        <input type="text" name="nombre" autoComplete="name"
                          className={`form-control rounded-3 ${touched.nombre && errors.nombre ? "is-invalid" : ""}`}
                          value={formData.nombre} onChange={handleChange} onBlur={handleBlur} />
                        {touched.nombre && errors.nombre && <div className="invalid-feedback">Ingresá al menos 3 caracteres.</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Teléfono *</label>
                        <input type="tel" name="telefono" autoComplete="tel" placeholder="+54 11 1234-5678"
                          className={`form-control rounded-3 ${touched.telefono && errors.telefono ? "is-invalid" : ""}`}
                          value={formData.telefono} onChange={handleChange} onBlur={handleBlur} />
                        {touched.telefono && errors.telefono && <div className="invalid-feedback">Ingresá un teléfono válido.</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Email *</label>
                        <input type="email" name="email" autoComplete="email"
                          className={`form-control rounded-3 ${touched.email && errors.email ? "is-invalid" : ""}`}
                          value={formData.email} onChange={handleChange} onBlur={handleBlur} />
                        {touched.email && errors.email && <div className="invalid-feedback">Ingresá un email válido.</div>}
                      </div>
                      <div className="col-12">
                        <label className="form-label d-flex justify-content-between">
                          <span>Mensaje *</span>
                          <span className={`small ${charCount > 1200 ? "text-danger" : "text-muted"}`}>{charCount}/1200</span>
                        </label>
                        <textarea name="mensaje" rows={6} className={`form-control rounded-3 ${touched.mensaje && errors.mensaje ? "is-invalid" : ""}`}
                          value={formData.mensaje} onChange={handleChange} onBlur={handleBlur} placeholder="Contanos tu consulta..." />
                        {touched.mensaje && errors.mensaje && <div className="invalid-feedback">Escribí entre 10 y 1200 caracteres.</div>}
                      </div>
                      <div className="visually-hidden">
                        <input type="text" name="sitio" tabIndex={-1} autoComplete="off" value={formData.sitio} onChange={handleChange} />
                      </div>
                      <div className="col-12 text-center mt-3">
                        <button type="submit" className="btn btn-info px-5 py-2 rounded-pill fw-bold shadow-sm" disabled={enviosRestantes <= 0 || sending || !isValid}>
                          {sending ? <span className="spinner-border spinner-border-sm me-2" role="status" /> : "ENVIAR MENSAJE"}
                        </button>
                        <p className="mt-2 text-muted small">{enviosRestantes > 0 ? `Podés enviar ${enviosRestantes} mensaje${enviosRestantes===1?"":"s"} más.` : "Límite de envíos alcanzado."}</p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>

            {/* Ubicación */}
            <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="col-12 col-lg-6"
            style={{
                background: "#4ed1c052",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 0 20px rgba(0, 0, 0, 0.31)"
              }}
            >
                <div className="card-body p-4">
                  <UBICACIONCOOP />
                  <br />
                  <h3 className="h5 fw-semibold mb-3 contacto-subtitle">Contacto</h3>
                  <div className="d-flex flex-column gap-2 contacto-links">
                    <a href="mailto:vidrieriaflorida@gmail.com.ar">vidrieriaflash@gmail.comr</a>
                    <a href="tel:+541127135239">+54 15 5736 8801</a>
                    <a href="https://instagram.com/" target="_blank">Instagram</a>
                  </div>
                </div>
            </motion.div>
          </div>
        </div>
      </div>
  );
}
