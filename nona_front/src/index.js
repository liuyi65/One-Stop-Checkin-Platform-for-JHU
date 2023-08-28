import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import "bootstrap/dist/css/bootstrap.min.css"

import { BrowserRouter as Router, Route, Routes} from "react-router-dom"
const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <React.StrictMode>
    <Router forceRefresh={true}>
      <App />
    </Router>
    
  </React.StrictMode>
);

