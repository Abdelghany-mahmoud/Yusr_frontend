import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { I18nextProvider } from "react-i18next";
import { RecoilRoot } from "recoil";
import i18n from "./Config/locale/i18n";
import { Loading } from "./components/index.js";
import { PusherProvider } from "./lib/PusherProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <RecoilRoot>
        <Suspense fallback={<Loading height={"100vh"} />}>
          <PusherProvider>
            <App />
          </PusherProvider>
        </Suspense>
      </RecoilRoot>
    </I18nextProvider>
  </StrictMode>
);
