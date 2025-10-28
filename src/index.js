import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

const rootElement = document.getElementById('root');

createRoot(rootElement).render(
  React.createElement(
    StrictMode,
    null,
    React.createElement(App),
  ),
);
