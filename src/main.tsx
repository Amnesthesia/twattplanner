import React from "react";
import "./index.css";
import App from "./App";
import { createRoot } from "react-dom/client";
import { SpreadsheetProvider } from "./Context/SpreadsheetContext";

const rootContainer = document.getElementById("root");
const root = createRoot(rootContainer!);
root.render(
  <React.StrictMode>
    <SpreadsheetProvider>
      <App />
    </SpreadsheetProvider>
  </React.StrictMode>
);
