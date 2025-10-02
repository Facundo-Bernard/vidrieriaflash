import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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
    <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light rounded mb-1">
      <Link className="navbar-brand" to="/">Navbar</Link>
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
