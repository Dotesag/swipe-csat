import 'bootstrap/dist/css/bootstrap.min.css'; // Подключение Bootstrap
import 'bootstrap/dist/js/bootstrap.min.js'; // Подключение Bootstrap
import React from 'react';
import ReactDOM from 'react-dom/client'; // Используем новый API React 18
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Опциональная функция для измерения производительности
reportWebVitals();
