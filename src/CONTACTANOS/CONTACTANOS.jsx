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

const DEFAULT_TIMEOUT = 5000; // ms
const MAX_RETRIES = 2;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

function mapErrorToMessage(err) {
  // err might be Error object, string, or an object from emailjs
  const msg = (err && (err.message || err.text || String(err))) || "Error desconocido";
  if (msg.toLowerCase().includes("timeout")) return { user: "La conexión tardó demasiado. Intentá nuevamente.", technical: msg, code: "timeout" };
  if (msg.toLowerCase().includes("network")) return { user: "Error de red. Revisá tu conexión a Internet.", technical: msg, code: "network" };
  if (msg.toLowerCase().includes("service") || msg.toLowerCase().includes("template") || msg.toLowerCase().includes("public")) {
    // config-related strings
    return { user: "Error de configuración del servicio de correo. Contactá al administrador.", technical: msg, code: "config" };
  }
  // fallback
  return { user: "Ocurrió un error al enviar. Intentá nuevamente más tarde.", technical: msg, code: "unknown" };
}

export default function ContactoForm() {
  const [formData, setFormData] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error | limit | offline | config
  const [detailedError, setDetailedError] = useState(null);
  const [sending, setSending] = useState(false);
  const [enviosRestantes, setEnviosRestantes] = useState(3);
  const [charCount, setCharCount] = useState(0);
  const statusRef = useRef(null);
  const isMounted = useRef(true);
  const retryCountRef = useRef(0);

  // Cached env vars (read once)
  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  useEffect(() => {
    isMounted.current = true;
    const storedLimit = localStorage.getItem(STORAGE_LIMIT_KEY);
    if (storedLimit) setEnviosRestantes(parseInt(storedLimit, 10));
    const draftRaw = localStorage.getItem(STORAGE_DRAFT_KEY);
    if (draftRaw) {
      try {
        const draft = JSON.parse(draftRaw);
        setFormData({ ...initialForm, ...draft, sitio: "" });
        setCharCount((draft.mensaje || "").length);
      } catch (e) {
        console.warn("ContactoForm: error parsing draft", e);
      }
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { sitio, ...draft } = formData;
    try {
      localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(draft));
    } catch (e) {
      // localStorage might fail in some privacy modes
      console.warn("ContactoForm: cannot write draft to localStorage", e);
    }
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

  const scrollToStatus = () => {
    requestAnimationFrame(() => {
      if (statusRef.current) statusRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  // Utility to check config
  const checkConfig = () => {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      return false;
    }
    return true;
  };

  // Send with retries
  const sendWithRetries = async (payload) => {
    retryCountRef.current = 0;
    while (retryCountRef.current <= MAX_RETRIES) {
      try {
        // emailjs.send returns a Promise; add timeout wrapper
        const sendPromise = emailjs.send(SERVICE_ID, TEMPLATE_ID, payload, PUBLIC_KEY);
        await withTimeout(sendPromise, DEFAULT_TIMEOUT);
        return { ok: true };
      } catch (err) {
        const mapped = mapErrorToMessage(err);
        // If it's a config error, don't retry
        if (mapped.code === "config") {
          return { ok: false, mapped, fatal: true };
        }
        // If offline or network error -> don't spam retries, just return
        if (!navigator.onLine || mapped.code === "network") {
          return { ok: false, mapped, fatal: true };
        }
        // Timeout/unknown: we can retry a couple times
        retryCountRef.current += 1;
        const backoff = 600 * Math.pow(2, retryCountRef.current - 1); // 600ms, 1200ms...
        // Log the retry
        console.warn(`ContactoForm: retry #${retryCountRef.current} after error`, err);
        await sleep(backoff);
        // continue loop
      }
    }
    return { ok: false, mapped: mapErrorToMessage(new Error("max_retries_exceeded")), fatal: false };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDetailedError(null);
    // reset accessible status message
    setStatus(null);

    // Quick pre-checks
    if (enviosRestantes <= 0) {
      setStatus("limit");
      scrollToStatus();
      return;
    }
    if (!isValid) {
      setTouched(Object.keys(initialForm).reduce((a, k) => ((a[k] = true), a), {}));
      // show error summary
      setStatus("error");
      setDetailedError("Por favor corregí los campos marcados.");
      scrollToStatus();
      return;
    }
    if (formData.sitio && formData.sitio.trim()) {
      setStatus("error");
      setDetailedError("Se detectó posible spam (campo oculto completado).");
      scrollToStatus();
      return;
    }
    if (!navigator.onLine) {
      setStatus("offline");
      setDetailedError("Tu dispositivo parece estar desconectado. Revisá la conexión e intentá de nuevo.");
      scrollToStatus();
      return;
    }
    if (!checkConfig()) {
      setStatus("config");
      setDetailedError("Falta configurar las claves de EmailJS en el entorno. Contactá al administrador.");
      scrollToStatus();
      return;
    }

    // Build payload
    const payload = {
      ...formData,
      submittedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
      // optionally include origin for easier debugging
      origin: typeof window !== "undefined" ? window.location.href : "ssr",
    };

    try {
      setSending(true);
      setStatus("sending");
      scrollToStatus();

      const result = await sendWithRetries(payload);

      if (!isMounted.current) return;

      if (result.ok) {
        setStatus("success");
        setFormData(initialForm);
        setCharCount(0);
        try {
          localStorage.removeItem(STORAGE_DRAFT_KEY);
        } catch (e) {
          console.warn("ContactoForm: cannot remove draft from localStorage", e);
        }
        const nuevo = Math.max(0, enviosRestantes - 1);
        setEnviosRestantes(nuevo);
        try {
          localStorage.setItem(STORAGE_LIMIT_KEY, String(nuevo));
        } catch (e) {
          console.warn("ContactoForm: cannot write limit to localStorage", e);
        }
      } else {
        // show friendly message and attach technical detail
        const mapped = result.mapped || mapErrorToMessage(new Error("unknown"));
        setStatus(result.fatal ? "error" : "error");
        setDetailedError(mapped.technical || String(mapped));
        // If it's a config error, also log a clear message
        if (mapped.code === "config") {
          console.error("ContactoForm: configuration error detected - check EmailJS env vars.");
        }
      }
    } catch (err) {
      // Unexpected top-level error
      const mapped = mapErrorToMessage(err);
      setStatus("error");
      setDetailedError(mapped.technical || String(mapped));
      console.error("ContactoForm: unexpected send error", err);
    } finally {
      if (isMounted.current) {
        setSending(false);
        scrollToStatus();
      }
    }
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
            <div
              className="card rounded-4 border-0 contacto-card"
              style={{
                background: "#4ed1c052",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 0 20px rgba(0, 0, 0, 0.31)",
              }}
            >
              <div className="card-body p-4">
                <div ref={statusRef} aria-live="polite" aria-atomic="true" className="mb-3">
                  {status === "success" && <div className="alert alert-success rounded-3">Mensaje enviado con éxito. ¡Gracias!</div>}
                  {status === "sending" && <div className="alert alert-info rounded-3">Enviando... por favor esperá.</div>}
                  {status === "offline" && <div className="alert alert-warning rounded-3">No hay conexión. Verificá tu red e intentá nuevamente.</div>}
                  {status === "config" && <div className="alert alert-danger rounded-3">Error de configuración. Contactá al administrador del sitio.</div>}
                  {status === "limit" && <div className="alert alert-warning rounded-3">Límite de envíos por sesión alcanzado.</div>}
                  {status === "error" && (
                    <div className="alert alert-danger rounded-3">
                      Ocurrió un error. Intentá nuevamente.
                      {detailedError && (
                        <>
                          <div className="mt-2 small text-muted">Detalle técnico disponible.</div>
                          <button
                            type="button"
                            className="btn btn-link btn-sm p-0"
                            onClick={() => {
                              // toggle detailed view in a simple way
                              const el = document.getElementById("detailed-error");
                              if (el) {
                                el.style.display = el.style.display === "block" ? "none" : "block";
                              }
                            }}
                          >
                            Ver detalle
                          </button>
                          <div id="detailed-error" style={{ display: "none", marginTop: 8 }}>
                            <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, color: "#333" }}>{String(detailedError)}</pre>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nombre *</label>
                      <input
                        type="text"
                        name="nombre"
                        autoComplete="name"
                        className={`form-control rounded-3 ${touched.nombre && errors.nombre ? "is-invalid" : ""}`}
                        value={formData.nombre}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={touched.nombre && errors.nombre ? "true" : "false"}
                      />
                      {touched.nombre && errors.nombre && <div className="invalid-feedback">Ingresá al menos 3 caracteres.</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Teléfono *</label>
                      <input
                        type="tel"
                        name="telefono"
                        autoComplete="tel"
                        placeholder="+54 11 1234-5678"
                        className={`form-control rounded-3 ${touched.telefono && errors.telefono ? "is-invalid" : ""}`}
                        value={formData.telefono}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={touched.telefono && errors.telefono ? "true" : "false"}
                      />
                      {touched.telefono && errors.telefono && <div className="invalid-feedback">Ingresá un teléfono válido.</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        className={`form-control rounded-3 ${touched.email && errors.email ? "is-invalid" : ""}`}
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={touched.email && errors.email ? "true" : "false"}
                      />
                      {touched.email && errors.email && <div className="invalid-feedback">Ingresá un email válido.</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label d-flex justify-content-between">
                        <span>Mensaje *</span>
                        <span className={`small ${charCount > 1200 ? "text-danger" : "text-muted"}`}>{charCount}/1200</span>
                      </label>
                      <textarea
                        name="mensaje"
                        rows={6}
                        className={`form-control rounded-3 ${touched.mensaje && errors.mensaje ? "is-invalid" : ""}`}
                        value={formData.mensaje}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Contanos tu consulta..."
                        aria-invalid={touched.mensaje && errors.mensaje ? "true" : "false"}
                      />
                      {touched.mensaje && errors.mensaje && <div className="invalid-feedback">Escribí entre 10 y 1200 caracteres.</div>}
                    </div>

                    {/* honeypot */}
                    <div className="visually-hidden">
                      <input type="text" name="sitio" tabIndex={-1} autoComplete="off" value={formData.sitio} onChange={handleChange} />
                    </div>

                    <div className="col-12 text-center mt-3">
                      <button
                        type="submit"
                        className="btn btn-info px-5 py-2 rounded-pill fw-bold shadow-sm"
                        disabled={enviosRestantes <= 0 || sending || !isValid || !navigator.onLine}
                        aria-disabled={enviosRestantes <= 0 || sending || !isValid || !navigator.onLine}
                      >
                        {sending ? <span className="spinner-border spinner-border-sm me-2" role="status" /> : "ENVIAR MENSAJE"}
                      </button>
                      <p className="mt-2 text-muted small">
                        {enviosRestantes > 0 ? `Podés enviar ${enviosRestantes} mensaje${enviosRestantes === 1 ? "" : "s"} más.` : "Límite de envíos alcanzado."}
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>

          {/* Ubicación */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="col-12 col-lg-6"
            style={{
              background: "#4ed1c052",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 0 20px rgba(0, 0, 0, 0.31)",
            }}
          >
            <div className="card-body p-4">
              <UBICACIONCOOP />
              <br />
              <h3 className="h5 fw-semibold mb-3 contacto-subtitle">Contacto</h3>
              <div className="d-flex flex-column gap-2 contacto-links">
                <a href="mailto:Cristalesflorida@gmail.com.ar">Cristalesflash@gmail.comr</a>
                <a href="tel:+541127135239">+54 15 5736 8801</a>
                <a href="https://instagram.com/" target="_blank" rel="noreferrer">Instagram</a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
