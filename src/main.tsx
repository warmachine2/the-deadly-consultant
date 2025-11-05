import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx"; // Points to the root above
import "./index.css"; // Your Tailwind entry

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
