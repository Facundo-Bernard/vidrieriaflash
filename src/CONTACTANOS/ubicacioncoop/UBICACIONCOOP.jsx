// src/components/DondeEncontrarnos.jsx
import React from 'react';

function DONDEENCONTRARNOS({
  query = "Suipacha 925 local 7",
  instructions = [
    "Encontranos en Galería las américas",
    "Suipacha 925",
    "Local 7"
  ],
  zoom = 15,
  mapHeight = "300px"
}) {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`;

  return (
    <section
      className="py-5"
      style={{ backgroundColor: "#f8f9fa" }}
      id="donde-encontrarnos"
    >
      <div className="container animate__animated animate__fadeInUp">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Dónde encontrarnos</h2>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-10">

            {/* Mapa embebido */}
            <div style={{ width: '100%', height: mapHeight, marginBottom: '1rem' }}>
              <iframe
                title="Ubicación"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0, borderRadius: '8px' }}
                src={src}
                allowFullScreen
              />
            </div>

            {/* Instrucciones */}
            <p className="lead text-center mb-2">
              {instructions[0]}
            </p>
            <p className="text-center mb-0">
              {instructions.slice(1).join(' ')}
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}

export default DONDEENCONTRARNOS;
