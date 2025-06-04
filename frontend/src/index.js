// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Keep this for any custom global CSS

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Import Bootstrap JavaScript bundle (includes Popper.js)
import 'bootstrap/dist/js/bootstrap.bundle.min';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
