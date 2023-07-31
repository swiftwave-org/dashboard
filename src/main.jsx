// Librairies
import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BrowserView, MobileView } from "react-device-detect";

// Stylesheets
import "./sass/application.scss";

// Assets

// Components
import cutomTheme from "./theme";

// Pages
import SetupPage from "./pages/setup.jsx";
import MobileVersionNotAvailalePage from "./pages/mobileNotAvailable.jsx";

window.addEventListener('resize', () => {
  window.location.reload();
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserView>
      <ChakraProvider theme={cutomTheme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SetupPage />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </BrowserView>
    <MobileView>
      <ChakraProvider theme={cutomTheme}>
        <MobileVersionNotAvailalePage />
      </ChakraProvider>
    </MobileView>
  </React.StrictMode>
);
