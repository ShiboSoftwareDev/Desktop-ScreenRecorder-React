import { createRoot } from "react-dom/client";
import React from "react";
import Main from "./components/Main";

const root = createRoot(document.body);
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
