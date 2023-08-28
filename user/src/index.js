import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import configureStore from './store';
import ModalProvider from './context/Modal';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom"
const store = configureStore();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ModalProvider>

        <App />
 
      </ModalProvider>
    </Provider>
  </React.StrictMode>
);
