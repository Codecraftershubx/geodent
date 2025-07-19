//import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "@/appState/store.js";
import { ThemeProvider } from "@/hooks/UseTheme";
import "@/index.css";
import App from "@/App.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Provider>
);
