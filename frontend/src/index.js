import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { ContextProvider } from "./context"; // ✅ IMPORTANT

// Create root
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ContextProvider> {/* ✅ WRAP THE ENTIRE APP */}
      <RouterProvider router={router} />
    </ContextProvider>
  </React.StrictMode>
);

// Performance monitoring
reportWebVitals();
