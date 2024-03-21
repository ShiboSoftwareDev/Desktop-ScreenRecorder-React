import { createRoot } from "react-dom/client";
import React from "react";
import Main from "./components/Main";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
