import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// StrictMode removed — it double-mounts components in dev which causes
// Clerk's SDK to initialise twice and hit Clerk's 429 rate limit.
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
