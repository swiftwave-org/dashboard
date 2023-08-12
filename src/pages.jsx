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
import DeployedApplicationDetailPage from "./pages/deployed_application/detail.jsx";
import DeployedApplicationListPage from "./pages/deployed_application/list.jsx";
import DeployedApplicationNewPage from "./pages/deployed_application/new.jsx";

// Domain Management
import DomainManagementPage from "./pages/domain_management";

// Ingress Rules Management
import IngressRulesPage from "./pages/ingress_rules";

// Redirect Rules Management
import RedirectRulesPage from "./pages/redirect_rules";

// Git Credential Management
import GitCredentialManagementPage from "./pages/git_credential_management";
import VolumeManagementPage from "./pages/volume_management";

const Pages = () => {
  const authContext = useContext(AuthContext);

  return !authContext.isAuthenticated() ? (
    <Routes>
      <Route path="/*" element={<LoginPage />} />
    </Routes>
  ) : (
    <Box display="grid" gridTemplateColumns="1fr 4fr">
      <Sidebar />
      <Routes>
        <Route
          path="/application/deploy/list"
          element={<DeployedApplicationListPage />}
        />
        <Route
          path="/application/deploy/detail"
          element={<DeployedApplicationDetailPage />}
        />
        <Route
          path="/application/deploy/new"
          element={<DeployedApplicationNewPage />}
        />
        <Route path="/git" element={<GitCredentialManagementPage />} />
        <Route path="/domain" element={<DomainManagementPage />} />
        <Route path="/ingress" element={<IngressRulesPage />} />
        <Route path="/redirect" element={<RedirectRulesPage />} />
        <Route path="/volume" element={<VolumeManagementPage />} />
      </Routes>
    </Box>
  );
};

export default Pages;
