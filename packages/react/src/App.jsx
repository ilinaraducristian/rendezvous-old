import React from "react";

// LIBRARIES
import { BrowserRouter } from "react-router-dom";

// COMPONENTS
import AppRoutes from "../../react/src/config/appRoutes";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );

  // <Main />
}

export default App;
