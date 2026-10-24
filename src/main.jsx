import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { reduxConfig } from "./app/reduxConfig.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={reduxConfig}>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        draggable
        style={{ zIndex: 999999 }}
      />
      
    </Provider>
  </React.StrictMode>,
);
