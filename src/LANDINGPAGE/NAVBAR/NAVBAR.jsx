
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/logo.png"

function NAVBAR() {

    const navigate = useNavigate();

  const handleProductosClick = (e) => {
    e.preventDefault();
    navigate("/"); // navegamos a home primero
    setTimeout(() => {
      const element = document.getElementById("productos");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };








  return (
    <nav className="navbar sticky-top navbar-expand-lg navbar-light shadow bg-light p-0 rounded">
      <Link to="/" className="navbar-brand p-0">
        <img
          src={logo}
          alt="Logo"
          style={{
            width: "120px",
            padding:"0",
            margin:"0",       // mantiene proporción
            maxWidth: "100%",    // evita desbordes
            objectFit: "contain" // no se deforma
          }}
        />
      </Link>


      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <Link className="nav-item nav-link active" to="/">Home</Link>
          <li className="nav-item">
              <a
                className="nav-link"
                href="/#productos"
                onClick={handleProductosClick}
              >
                Productos
              </a>
            </li>
          <Link className="nav-item nav-link" to="/contactanos">Contactanos</Link>
        </div>
      </div>
    </nav>
  );
}

export default NAVBAR;
