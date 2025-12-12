import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      className="border shadow py-4 mt-5"
      style={{
        backgroundColor: "#0b5047ff",
        boxShadow: "0 -4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <div className="container">
        <div className="row text-center text-md-start">
          {/* Redes sociales */}
          <div className="col-12 col-md-4 mb-4 mb-md-0">
            <h6 className="fw-light mb-3 text-white">Seguinos</h6>
            <div className="d-flex justify-content-center justify-content-md-start gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="text-white"
              >
                <FaFacebook size={22} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-white"
              >
                <FaInstagram size={22} />
              </a>
              <a
                href="https://wa.me/123456789"
                target="_blank"
                rel="noreferrer"
                className="text-white"
              >
                <FaWhatsapp size={22} />
              </a>
            </div>
          </div>

          {/* Teléfono y mail */}
          <div className="col-12 col-md-4 mb-4 mb-md-0">
            <h6 className="fw-light mb-3 text-white">Contacto</h6>
            <p className="mb-1 text-light">Tel: +54 15 5736 8801</p>
            <p className="mb-0 text-light">Email: Cristalesflash@gmail.com</p>
          </div>

          {/* Ubicación */}
          <div className="col-12 col-md-4">
            <h6 className="fw-light mb-3 text-white">Ubicación</h6>
            <p className="mb-1 text-light">Local 7 Galeria de las Americas</p>
            <p className="mb-0 text-light">Suipacha 925/927</p>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="text-center mt-4">
          <small className="text-light">
            © {new Date().getFullYear()} VidrieríaFlash - Todos los derechos reservados
          </small>
        </div>
      </div>
    </footer>
  );
}
