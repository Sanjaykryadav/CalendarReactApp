import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "rsuite/dist/rsuite.min.css";
import { CustomProvider } from "rsuite";
import { ContextProvider } from "./Context";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ContextProvider>
      <CustomProvider>
        <App />
      </CustomProvider>
    </ContextProvider>
  </React.StrictMode>
);
