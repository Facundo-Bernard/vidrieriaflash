import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import './index.css';

// ----------- BOOTSTRAP IMPORTS -----------
// CSS principal de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// JS Bundle de Bootstrap (Popper incluido)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Opcional: íconos de Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css';
// ----------------------------------------

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
