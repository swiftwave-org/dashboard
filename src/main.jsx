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
import ControllerState from "./context/controller/ControllerState";

window.addEventListener("resize", () => {
  window.location.reload();
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigState>
      <AuthState>
        <ControllerState>
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
        </ControllerState>
      </AuthState>
    </ConfigState>
  </React.StrictMode>
);
