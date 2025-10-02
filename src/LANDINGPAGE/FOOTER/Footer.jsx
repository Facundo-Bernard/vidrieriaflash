import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-light border-top py-4 mt-5">
      <div className="container">
        <div className="row text-center text-md-start">
          {/* Redes sociales */}
          <div className="col-12 col-md-4 mb-4 mb-md-0">
            <h6 className="fw-light mb-3">Seguinos</h6>
            <div className="d-flex justify-content-center justify-content-md-start gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="text-dark"
              >
                <FaFacebook size={22} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-dark"
              >
                <FaInstagram size={22} />
              </a>
              <a
                href="https://wa.me/123456789"
                target="_blank"
                rel="noreferrer"
                className="text-dark"
              >
                <FaWhatsapp size={22} />
              </a>
            </div>
          </div>

          {/* Teléfono y mail */}
          <div className="col-12 col-md-4 mb-4 mb-md-0">
            <h6 className="fw-light mb-3">Contacto</h6>
            <p className="mb-1 text-muted">Tel: +54 11 1234 5678</p>
            <p className="mb-0 text-muted">Email: contacto@vidrieriaflash.com</p>
          </div>

          {/* Ubicación */}
          <div className="col-12 col-md-4">
            <h6 className="fw-light mb-3">Ubicación</h6>
            <p className="mb-1 text-muted">Av. Siempreviva 123</p>
            <p className="mb-0 text-muted">Florida, Buenos Aires, Argentina</p>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="text-center mt-4">
          <small className="text-muted">
            © {new Date().getFullYear()} VidrieríaFlash - Todos los derechos reservados
          </small>
        </div>
      </div>
    </footer>
  );
}
