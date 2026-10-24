import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { reduxConfig } from "./app/reduxConfig.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import dayjs from "dayjs";
import "dayjs/locale/es";
import esES from "antd/locale/es_ES";
import { ConfigProvider } from "antd";

// Español para fechas (dayjs) y componentes de Ant Design. Antes esta
// configuración estaba en src/index.js, que no se cargaba nunca.
dayjs.locale("es");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={reduxConfig}>
      <ConfigProvider locale={esES}>
        <App />
      </ConfigProvider>
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
