import React from 'react';
import ReactDOM from 'react-dom/client';
// Base tokens and primitives first, so component stylesheets can override them.
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
