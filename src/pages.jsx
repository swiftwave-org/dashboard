import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { Box } from "@chakra-ui/react";

// Contexts
import AuthContext from "./context/auth/authContext";

// Components
import Sidebar from "./components/sidebar";

// Pages
import LoginPage from "./pages/login.jsx";

// Application Management
import DeployedApplicationManagementPage from "./pages/deployed_application_management";
import DeployApplicationPage from "./pages/deploy_application";

// Domain Management
import DomainManagementPage from "./pages/domain_management";

// Ingress Rules Management
import IngressRulesPage from "./pages/ingress_rules";

// Redirect Rules Management
import RedirectRulesPage from "./pages/redirect_rules";

// Git Credential Management
import GitCredentialManagementPage from "./pages/git_credential_management";
import VolumeManagementPage from "./pages/volume_management";
import LogoutPage from "./pages/logout";
import DeployedApplicationDetailsPage from "./pages/deployed_application_details";

const Pages = () => {
  const authContext = useContext(AuthContext);

  return !authContext.isAuthenticated() ? (
    <Routes>
      <Route path="/*" element={<LoginPage />} />
    </Routes>
  ) : (
    <Box display="grid" gridTemplateColumns="1fr 4fr">
      <Sidebar />
      <Box maxH="100vh" overflowY="scroll">
        <Routes>
          <Route
            path="/application"
            element={<DeployedApplicationManagementPage />}
          />
          <Route
            path="/application/:id"
            element={<DeployedApplicationDetailsPage />}
          />
          <Route
            path="/application/deploy"
            element={<DeployApplicationPage />}
          />
          <Route path="/git" element={<GitCredentialManagementPage />} />
          <Route path="/domain" element={<DomainManagementPage />} />
          <Route path="/ingress" element={<IngressRulesPage />} />
          <Route path="/redirect" element={<RedirectRulesPage />} />
          <Route path="/volume" element={<VolumeManagementPage />} />
          <Route path="/logout" element={<LogoutPage />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default Pages;
