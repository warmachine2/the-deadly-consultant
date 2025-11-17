import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Note: React.StrictMode is intentionally disabled in dev to avoid double-invoked effects
// that can cause duplicate modal opens. Re-enable for production checks.
// Example:
// createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

createRoot(document.getElementById("root")!).render(<App />);
