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
import LoginPage from "./pages/login.jsx";
// Remove this line when you start working on the project
import Dashboard from "./pages/dashboard";

window.addEventListener('resize', () => {
  window.location.reload();
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserView>
      <ChakraProvider theme={cutomTheme}>
        <BrowserRouter>
          <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/" element={<Dashboard />} />
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
