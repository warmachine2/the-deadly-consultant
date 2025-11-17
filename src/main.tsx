import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// StrictMode removed to fix multi-modal bug; re-enable after: <React.StrictMode><App /></React.StrictMode>
// To re-enable later, wrap <App /> as shown above.

// Plain render without StrictMode
createRoot(document.getElementById("root")!).render(<App />);
