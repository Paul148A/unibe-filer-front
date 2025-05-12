import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./routes/routes.tsx";
import React from "react";
import { UseContext } from "./components/Context/hooks/use-context.tsx";
import CustomAlert from "./components/CustomAlert/custom-alert.tsx";
import { AlertProvider } from "./components/Context/AlertContext.tsx";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AlertProvider>
      <UseContext>
        <AppRouter />
        <CustomAlert />
      </UseContext>
    </AlertProvider>
  </React.StrictMode>
);
