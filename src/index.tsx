import React from "react";
import ReactDOM from "react-dom";
import "index.css";
import reportWebVitals from "reportWebVitals";
import AppComponent from "components/app/App.component";
import {store} from "state-management/store";
import {Provider} from "react-redux";

ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <AppComponent/>
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);


reportWebVitals();
