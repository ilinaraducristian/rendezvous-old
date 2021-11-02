import React from "react";
import ReactDOM from "react-dom";
import "index.css";
import reportWebVitals from "reportWebVitals";
import AppComponent from "components/App/App.component";
import {store} from "state-management/store";
import {Provider} from "react-redux";
import {setOverlay} from "state-management/slices/data/data.slice";

document.onkeyup = (event: any) => {
    if (event.code !== "Escape") return false;
    store.dispatch(setOverlay(null));
};

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <AppComponent/>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);


reportWebVitals();
