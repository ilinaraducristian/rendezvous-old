import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';


// LIBRARIES
import { BrowserRouter } from "react-router-dom";

// COMPONENTS
import AppRoutes from "../../react/src/config/appRoutes";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>
);


