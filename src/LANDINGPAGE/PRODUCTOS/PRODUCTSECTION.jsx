import { useEffect, useState } from "react";
import PRODUCTCARD from "./PRODUCTCARD";

const backendUrl = "";

function ProductsSection({
  defaultProducts = [
    { title: "Vidrio templado", description: "Resistente y elegante.", image: "https://via.placeholder.com/300" },
    { title: "Espejo moderno", description: "Ideal para interiores minimalistas.", image: "https://via.placeholder.com/300" },
    { title: "Ventanales grandes", description: "Diseño amplio con máxima claridad.", image: "https://via.placeholder.com/300" },
  ],
}) {
  const [products, setProducts] = useState(defaultProducts);

  useEffect(() => {
    const intervalo = setInterval(() => {
      fetch(`${backendUrl}/product`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
          }
        })
        .catch((err) => console.error("Error al cargar productos:", err));
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <section id="productos" className="py-5 bg-white">
      <div className="container">
        {/* Título Apple-like */}
        <h2
          className="mb-5 fw-light"
          style={{
          fontSize: "2.2rem",
          fontWeight: 300,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif',
          color: "#111",
          textAlign: "left",
        }}
        >
          Productos destacados
        </h2>

        <div className="row justify-content-center">
          {products.map((p, idx) => (
            <div className="col-md-4 mb-4 d-flex" key={idx}>
              <PRODUCTCARD
                title={p.title}
                description={p.description}
                image={p.image}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductsSection;
