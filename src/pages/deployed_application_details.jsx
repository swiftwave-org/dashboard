import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  FileSymlinkFileIcon,
  PlayIcon,
  SyncIcon,
} from "@primer/octicons-react";
import { useContext, useEffect, useState } from "react";
import ControllerContext from "../context/controller/ControllerContext";
import { formatReadableDate, showErrorToast, showSuccessToast } from "../utils";
import tag_color from "../config/tag_color";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import EnvironmentVariablesSetup from "./deploy_application/environment _variables";

export default function DeployedApplicationDetailsPage() {
  const { id } = useParams();
  const controller = useContext(ControllerContext);
  const toast = useToast();
  const navigate = useNavigate();
  const [loadingState, setLoadingState] = useState(-1);
  // -1: loading, 0: error, 1: success
  const [applicationDetails, setApplicationDetails] = useState({});
  // build logs record
  const [buildLogs, setBuildLogs] = useState([]);
  const [log, setLog] = useState("");
  const [runtimeLog, setRuntimeLog] = useState("");
  const [environmentVariables, setEnvironmentVariables] = useState([]);

  const fetchApplicationDetails = async (id) => {
    setLoadingState(-1);
    const res = await controller.applications.fetchDetails(id);
    if (res.status) {
      setApplicationDetails(res.data);
      let env_variables = [];
      if (res.data.environment_variables) {
        const tmp_env = JSON.parse(res.data.environment_variables);
        for (const key in tmp_env) {
          env_variables.push({
            key: key,
            value: tmp_env[key],
          });
        }
      }
      setEnvironmentVariables(env_variables);
      setLoadingState(1);
    } else {
      showErrorToast(toast, res.message);
      setLoadingState(0);
    }
  };

  const deleteApplication = async (id) => {
    const choice = confirm("Are you sure you want to delete this application?");
    if (!choice) return;
    const res = await controller.applications.delete(id);
    if (res.status) {
      showSuccessToast(toast, res.message);
      navigate("/application", {
        replace: true,
      });
    } else {
      showErrorToast(toast, res.message);
    }
  };

  const fetchBuildLogs = async (id) => {
    const res = await controller.applications.fetchBuildLogs(id);
    if (res.status) {
      setBuildLogs(res.data);
    } else {
      showErrorToast(toast, res.message);
    }
  };

  const fetchBuildLog = async (log_id) => {
    setLog("");
    const res = await controller.applications.fetchBuildLog(id, log_id);
    if (res.status) {
      setLog(res.data);
    } else {
      showErrorToast(toast, res.message);
    }
  };

  const fetchRuntimeLog = async () => {
    setRuntimeLog("");
    const res = await controller.applications.fetchRuntimeLog(id);
    if (res.status) {
      setRuntimeLog(res.data.logs);
    } else {
      showErrorToast(toast, res.message);
    }
  };

  const detailsToSourceDetails = (details) => {
    if (details.source.type === "git") {
      return (
        details.source.git_provider +
        " - " +
        details.source.repository_username +
        "/" +
        details.source.repository_name +
        " - " +
        details.source.branch +
        " - " +
        details.source.last_commit
      );
    }
    if (details.source.type === "tarball") {
      return "Source Code uploaded manually !";
    }
    if (details.source.type === "image") {
      return details.source.docker_image;
    }
  };

  const redeployApplication = async () => {
    const choice = confirm(
      "Are you sure you want to redeploy this application?\nThis will rebuild the application and deploy it."
    );
    if (!choice) return;
    const res = await controller.applications.redeploy(id);
    if (res.status) {
      showSuccessToast(toast, res.message);
      fetchApplicationDetails(id);
    }
  };

  const updateRedeployApplication = async () => {
    let choice = confirm("Are you sure you want to update this application?");
    if (!choice) return;
    let env_variables = {};
    for (const entry of environmentVariables) {
      env_variables[entry.key] = entry.value;
    }
    let data = {
      environment_variables: env_variables,
      build_args: JSON.parse(applicationDetails.build_args),
      dockerfile: applicationDetails.dockerfile,
      replicas: applicationDetails.replicas,
      source: {
        type: applicationDetails.source.type,
        git_credential_id: applicationDetails.source.git_credential.id,
        repository_username: applicationDetails.source.repository_username,
        repository_name: applicationDetails.source.repository_name,
        branch: applicationDetails.source.branch,
        tarball_file: applicationDetails.source.tarball_file,
        docker_image: applicationDetails.source.docker_image,
      },
    };
    const res = await controller.applications.update(id, data);
    if (res.status) {
      showSuccessToast(toast, res.message);
      fetchApplicationDetails(id);
    } else {
      showErrorToast(toast, res.message);
    }
  };

  useEffect(() => {
    fetchApplicationDetails(id);
    fetchBuildLogs(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      {loadingState === -1 ? (
        <div>Loading...</div>
      ) : loadingState === 0 ? (
        <div>Error</div>
      ) : (
        <Box p="10">
          <Card mb="10" p="0">
            <CardBody>
              <Flex justifyContent="space-between">
                <Flex>
                  <Heading as="h2" size="md" mr="4">
                    {applicationDetails.service_name}
                  </Heading>
                  <Tag
                    size="md"
                    key="md"
                    variant="solid"
                    colorScheme={tag_color[applicationDetails.status]}
                    fontWeight="bold"
                    borderRadius="md"
                    style={{
                      textTransform: "uppercase",
                    }}
                  >
                    {applicationDetails.status}
                  </Tag>
                </Flex>
                <Flex gap="10px">
                  <Button size="sm" onClick={() => fetchApplicationDetails(id)}>
                    <Icon as={SyncIcon} mr="2" />
                    Refresh
                  </Button>
                  <Button size="sm" onClick={() => redeployApplication(id)}>
                    <Icon as={PlayIcon} mr="2" />
                    Rebuild & deploy
                  </Button>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => deleteApplication(id)}
                  >
                    <Icon as={DeleteIcon} mr="2" />
                    Delete
                  </Button>
                </Flex>
              </Flex>
            </CardBody>
          </Card>
          {/* TODO: add form */}
          <Tabs variant="soft-rounded" colorScheme="green">
            <TabList>
              <Tab>Application Details</Tab>
              <Tab>Build Logs</Tab>
              <Tab>Runtime Logs</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {/* Info */}
                <Card mb="6" p="0">
                  <CardBody>
                    <Text mb="4">
                      <Text as="span" fontWeight="bold">
                        Application Name:{" "}
                      </Text>
                      {applicationDetails.service_name}
                    </Text>
                    <Text mb="4">
                      <Text as="span" fontWeight="bold">
                        Source:{" "}
                      </Text>
                      {detailsToSourceDetails(applicationDetails)}
                    </Text>
                    {applicationDetails.source.type === "git" && (
                      <Text mb="4">
                        <Text as="span" fontWeight="bold">
                          Git Credential:{" "}
                        </Text>
                        {applicationDetails.source.git_credential.name} [
                        {applicationDetails.source.git_credential.username}]{" "}
                        <Link to="/git">
                          <Icon as={FileSymlinkFileIcon} />
                        </Link>
                      </Text>
                    )}
                  </CardBody>
                </Card>
                {/* Volumes */}
                <Card mb="6" p="0">
                  <CardBody>
                    <Heading as="h3" size="sm" mb="4">
                      Volumes
                    </Heading>
                    {Object.keys(JSON.parse(applicationDetails.volumes))
                      .length === 0 ? (
                      <Text>No volumes attached</Text>
                    ) : (
                      Object.entries(
                        JSON.parse(applicationDetails.volumes)
                      ).map(([name, path]) => (
                        <Text key={name}>
                          <Text as="span" fontWeight="bold">
                            Volume Name:{" "}
                          </Text>
                          {name}
                          <br />
                          <Text as="span" fontWeight="bold">
                            Volume Path:{" "}
                          </Text>
                          {path}
                        </Text>
                      ))
                    )}
                  </CardBody>
                </Card>
                {/* Build args */}
                <Card mb="6" p="0">
                  <CardBody>
                    <Heading as="h3" size="sm" mb="4">
                      Build Arguments
                    </Heading>
                    {Object.keys(JSON.parse(applicationDetails.build_args))
                      .length === 0 ? (
                      <Text>No build arguments</Text>
                    ) : (
                      Object.entries(
                        JSON.parse(applicationDetails.build_args)
                      ).map(([name, value]) => (
                        <Text key={name}>
                          {name} = {value}
                        </Text>
                      ))
                    )}
                  </CardBody>
                </Card>
                {/* Enironment Variables */}
                <Card mb="6" p="0">
                  <CardBody>
                    <Flex>
                      <Box minW="40vw">
                        <Heading as="h3" size="sm" mb="4">
                          Environment Variables
                        </Heading>
                        <Text mb="4">
                          Configure environment variables for your application.
                        </Text>
                      </Box>
                      <Box width="100%">
                        <EnvironmentVariablesSetup
                          environmentVariables={environmentVariables}
                          setEnvironmentVariables={setEnvironmentVariables}
                        />
                      </Box>
                    </Flex>
                  </CardBody>
                </Card>

                {/* Update & Redeploy */}
                <Box>
                  <Button
                    float="right"
                    colorScheme="green"
                    onClick={updateRedeployApplication}
                  >
                    Update & Redeploy
                  </Button>
                </Box>
              </TabPanel>
              <TabPanel>
                <Text mb="4">
                  Click on the date, to view/refresh build logs
                </Text>
                <Flex direction="row" gap="6px" mb="6">
                  {buildLogs.map((log, index) => (
                    <Button key={index} onClick={() => fetchBuildLog(log.id)}>
                      {formatReadableDate(log.time)}
                    </Button>
                  ))}
                </Flex>
                <Box maxH="60vh" overflowY="scroll">
                  <Text
                    colorScheme="gray"
                    style={{
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {log}
                  </Text>
                </Box>
              </TabPanel>
              <TabPanel>
                <Button onClick={() => fetchRuntimeLog()} mb="6">
                  Fetch Latest Runtime Logs
                </Button>
                <Box maxH="60vh" overflowY="scroll">
                  <Text
                    style={{
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {runtimeLog}
                  </Text>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      )}
    </>
  );
}
