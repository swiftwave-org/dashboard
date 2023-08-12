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
import ConfiguredDomainListPage from "./pages/domain/list";
import ConfiguredNewDomainPage from "./pages/domain/new";

// Ingress Rules Management
import IngressRuleListPage from "./pages/ingress/rules/list";
import IngressRuleNewPage from "./pages/ingress/rules/new";

// Redirect Rules Management
import RedirectRuleListPage from "./pages/ingress/redirect_rules/list";
import RedirectRuleNewPage from "./pages/ingress/redirect_rules/new";

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
        <Route path="/domain/list" element={<ConfiguredDomainListPage />} />
        <Route path="/domain/new" element={<ConfiguredNewDomainPage />} />
        <Route path="/ingress/rules/list" element={<IngressRuleListPage />} />
        <Route path="/ingress/rules/new" element={<IngressRuleNewPage />} />
        <Route
          path="/ingress/redirect_rules/list"
          element={<RedirectRuleListPage />}
        />
        <Route
          path="/ingress/redirect_rules/new"
          element={<RedirectRuleNewPage />}
        />
      </Routes>
    </Box>
  );
};

export default Pages;
