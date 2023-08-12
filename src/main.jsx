// Librairies
import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { BrowserView, MobileView } from "react-device-detect";

// Stylesheets
import "./sass/application.scss";

// Assets

// Components
import cutomTheme from "./theme";

// Pages
import MobileVersionNotAvailalePage from "./pages/mobileNotAvailable.jsx";

import Layout from "./layout";
import Pages from "./pages";

// Import context state
import ConfigState from "./context/config/configState";
import AuthState from "./context/auth/authState";

window.addEventListener("resize", () => {
  window.location.reload();
});


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigState>
      <AuthState>
        <BrowserView>
          <ChakraProvider theme={cutomTheme}>
            <Layout>
              <BrowserRouter>
                <Pages />
              </BrowserRouter>
            </Layout>
          </ChakraProvider>
        </BrowserView>
        <MobileView>
          <ChakraProvider theme={cutomTheme}>
            <MobileVersionNotAvailalePage />
          </ChakraProvider>
        </MobileView>
      </AuthState>
    </ConfigState>
  </React.StrictMode>
);
