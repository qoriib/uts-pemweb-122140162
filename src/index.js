import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App.jsx';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');

createRoot(rootElement).render(
  React.createElement(
    StrictMode,
    null,
    React.createElement(App),
  ),
);
