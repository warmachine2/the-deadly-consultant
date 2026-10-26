import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { isJobBoardUnlocked, applyUnlockedClass } from "./lib/jobBoardGate";

// Returning (signed-up) visitors get the popup-suppression class instantly on refresh.
if (isJobBoardUnlocked()) {
  applyUnlockedClass();
}

// StrictMode removed to fix multi-modal bug; re-enable after: <React.StrictMode><App /></React.StrictMode>
// To re-enable later, wrap <App /> as shown above.

// Plain render without StrictMode
createRoot(document.getElementById("root")!).render(<App />);
