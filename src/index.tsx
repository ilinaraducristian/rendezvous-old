import React from "react";
import ReactDOM from "react-dom";
import "index.css";
import reportWebVitals from "reportWebVitals";
import AppComponent from "components/app/App.component";
import {store} from "state-management/store";
import {Provider} from "react-redux";
import AuthProvider from "components/AuthProvider.component";

ReactDOM.render(
    <React.StrictMode>
      <AuthProvider>
        <Provider store={store}>
          <AppComponent/>
        </Provider>
      </AuthProvider>
    </React.StrictMode>,
    document.getElementById("root")
);


reportWebVitals();
