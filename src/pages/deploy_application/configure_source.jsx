/* eslint-disable react/no-unknown-property */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

import { showErrorToast, showSuccessToast } from "../../utils";
import EnvironmentVariablesSetup from "./environment _variables";

export default function ConfigureSourcePage({
  context,
  toast,
  activeStep,
  formRef,
  goToNext,
}) {
  // git, source-code, docker-image
  const [sourceType, setSourceType] = useState("");
  // Git Credentials
  const [gitCredentials, setGitCredentials] = useState([]);
  const [selectedGitCredential, setSelectedGitCredential] = useState("0");
  const [detectedServiceName, setDetectedServiceName] = useState("");
  const [dockerFile, setDockerFile] = useState("");
  const [editedDockerFile, setEditedDockerFile] = useState("");
  const [generatingConfig, setGeneratingConfig] = useState(false);
  const [buildArgs, setBuildArgs] = useState({});
  const [environmentVariables, setEnvironmentVariables] = useState([]);
  const uploadCodeFieldRef = useRef(null);
  const tarballRef = useRef(null);
  const dockerfileModalDisclosure = useDisclosure();

  // Is configuration generating
  const [isConfigurationGenerating, setIsConfigurationGenerating] =
    useState(false);
  // Is configuration generated
  const [isConfigurationGenerated, setIsConfigurationGenerated] =
    useState(false);

  const fetchGitCredentials = async () => {
    const res = await context.git_credentials.fetchAll();
    if (res.status === false) {
      showErrorToast(toast, res.message);
      return;
    } else {
      setGitCredentials(res.data);
    }
  };

  const generateConfig = async () => {
    // set form data
    formRef.current.source_type = sourceType;
    formRef.current.git_credential_id = parseInt(selectedGitCredential);

    if (sourceType === "git") {
      if (selectedGitCredential === "-1") {
        showErrorToast(toast, "Please select git credentials");
        return;
      }
      if (formRef.current.repository_url.length === 0) {
        showErrorToast(toast, "Please enter git repository url");
        return;
      }
      if (formRef.current.branch.length === 0) {
        showErrorToast(toast, "Please enter git branch");
        return;
      }
      setIsConfigurationGenerating(true);
      let res = await context.git_credentials.testAccess(
        selectedGitCredential,
        formRef.current.repository_url,
        formRef.current.branch
      );
      if (res.status === false) {
        setIsConfigurationGenerating(false);
        showErrorToast(toast, res.message);
        return;
      } else {
        setIsConfigurationGenerating(false);
        showSuccessToast(toast, res.message);
      }
    } else if (sourceType === "image") {
      if (formRef.current.docker_image.length === 0) {
        showErrorToast(toast, "Please enter docker image url");
        return;
      }
    }

    // generate configuration
    if (sourceType === "git") {
      const res = await context.applications.generateDockerConfigFromGit(
        formRef.current.git_credential_id,
        formRef.current.repository_url,
        formRef.current.branch
      );
      if (res.status === false) {
        showErrorToast(toast, res.message);
        setIsConfigurationGenerated(false);
        return;
      } else {
        setDetectedServiceName(res.data.detected_service);
        setDockerFile(res.data.docker_file);
        formRef.current.dockerfile = res.data.docker_file;
        setBuildArgs(res.data.variables);
        fillBuildArgsWithDefault(res.data.variables);
      }
    } else if (sourceType === "tarball") {
      // Tar file
      await createTarballFromField();
      const res = await context.applications.uploadTarFile(tarballRef.current);
      formRef.current.tarball_file = res.data.file;
      if (res.status === false) {
        showErrorToast(toast, res.message);
        setIsConfigurationGenerated(false);
        return;
      } else {
        // send tar file for generate docker config
        const res2 = await context.applications.generateDockerConfigFromTarball(
          res.data.file
        );
        if (res2.status === false) {
          showErrorToast(toast, res2.message);
          setIsConfigurationGenerated(false);
          return;
        } else {
          setDetectedServiceName(res2.data.detected_service);
          setDockerFile(res2.data.docker_file);
          formRef.current.dockerfile = res2.data.docker_file;
          setBuildArgs(res2.data.variables);
          fillBuildArgsWithDefault(res2.data.variables);
        }
      }
    } else if (sourceType === "image") {
      setDetectedServiceName("💁 No configuration required ! You can proceed");
    }

    setIsConfigurationGenerated(true);
  };

  const generateCustomConfigFromDockerfile = async () => {
    // if submitted dockerfile and previous one same then skip
    if (dockerFile === editedDockerFile) {
      dockerfileModalDisclosure.onClose();
      return;
    }
    // else submit | send request
    setGeneratingConfig(true);
    const res =
      await context.applications.generateDockerConfigFromCustomDockerfile(
        editedDockerFile
      );
    if (res.status === false) {
      showErrorToast(toast, res.message);
      setGeneratingConfig(false);
      return;
    }
    // update dockerfile & build args with default values both in state as well as in
    setDetectedServiceName(res.data.detected_service);
    setDockerFile(res.data.docker_file);
    formRef.current.dockerfile = res.data.docker_file;
    setBuildArgs(res.data.variables);
    fillBuildArgsWithDefault(res.data.variables);
    setGeneratingConfig(false);
    dockerfileModalDisclosure.onClose();
  };

  const fillBuildArgsWithDefault = (args) => {
    // clear all entry first
    formRef.current.build_args = {};
    // fill
    Object.entries(args).map(([key, value]) => {
      formRef.current.build_args[key] = value.default;
    });
  };

  const createTarballFromField = () => {
    return new Promise((resolve, reject) => {
      let files = uploadCodeFieldRef.current.files;
      const tarFiles = [];

      try {
        for (const file of files) {
          const reader = new FileReader();

          reader.onload = function (event) {
            const contentArrayBuffer = event.target.result;
            const contentUint8Array = new Uint8Array(contentArrayBuffer);
            tarFiles.push({
              name: file.webkitRelativePath.replace(/^.*?\//, ""),
              content: contentUint8Array,
            });

            if (tarFiles.length === files.length) {
              // eslint-disable-next-line no-undef
              const tarball = tarts(tarFiles);
              tarballRef.current = new Blob([tarball], {
                type: "application/x-tar",
              });
              resolve();
            }
          };

          reader.readAsArrayBuffer(file);
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  const chooseApplicationSourceType = (type) => {
    if (type === sourceType) return;
    if (sourceType !== "") {
      alert(
        "Can't switch source type once selected !\nTo change source type, please refresh the page"
      );
      return;
    }
    setSourceType(type);
  };

  const handleProceed = () => {
    // Set environment variables
    let tmp = {};
    for (let i = 0; i < environmentVariables.length; i++) {
      tmp[environmentVariables[i].key] = environmentVariables[i].value;
    }
    formRef.current.environment_variables = tmp;
    goToNext();
  };

  const openDockerfileEditModal = () => {
    // set docker file
    setEditedDockerFile(dockerFile);
    // open modal
    dockerfileModalDisclosure.onOpen();
  };

  useEffect(() => {
    fetchGitCredentials();
  }, []);

  useEffect(() => {
    if (uploadCodeFieldRef.current !== null) {
      uploadCodeFieldRef.current.setAttribute("directory", "");
      uploadCodeFieldRef.current.setAttribute("webkitdirectory", "");
      uploadCodeFieldRef.current.setAttribute("multiple", "");
    }
  }, [uploadCodeFieldRef]);

  return (
    <>
      <Center hidden={activeStep !== 1}>
        <Flex gap="80px">
          <Box w="25vw">
            {/* Choose Source */}
            <Flex gap="3" mb="10" justifyContent="center">
              <Button
                w="100%"
                borderRadius="full"
                colorScheme={sourceType === "git" ? "brand" : "gray"}
                onClick={() => chooseApplicationSourceType("git")}
              >
                Git Repo
              </Button>
              <Button
                w="100%"
                borderRadius="full"
                colorScheme={sourceType === "tarball" ? "brand" : "gray"}
                onClick={() => chooseApplicationSourceType("tarball")}
              >
                Upload Code
              </Button>
              <Button
                w="100%"
                borderRadius="full"
                colorScheme={sourceType === "image" ? "brand" : "gray"}
                onClick={() => chooseApplicationSourceType("image")}
              >
                Docker Image
              </Button>
            </Flex>
            {/* Git Repo */}
            <Box hidden={sourceType !== "git"}>
              <FormControl isRequired mb="4">
                <FormLabel>Git Credentials</FormLabel>
                <Select
                  placeholder="Select Git Credentials"
                  onChange={(e) => setSelectedGitCredential(e.target.value)}
                >
                  {gitCredentials.map((credential) => (
                    <option key={credential.id} value={credential.id}>
                      {credential.name} [{credential.username}]
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired mb="4">
                <FormLabel>Git Repo URL</FormLabel>
                <Input
                  placeholder="Git Repo URL"
                  onChange={(e) =>
                    (formRef.current.repository_url = e.target.value)
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Git Branch</FormLabel>
                <Input
                  placeholder="Git Branch"
                  onChange={(e) => (formRef.current.branch = e.target.value)}
                />
              </FormControl>
            </Box>

            {/* Upload code */}
            <FormControl hidden={sourceType !== "tarball"} isRequired>
              <FormLabel>Upload Code</FormLabel>
              <Input
                placeholder="Upload Code"
                type="file"
                ref={uploadCodeFieldRef}
              ></Input>
            </FormControl>

            {/* Docker Image */}
            <FormControl hidden={sourceType !== "image"} isRequired>
              <FormLabel>Docker Image URL</FormLabel>
              <Input
                placeholder="Docker Image URL"
                onChange={(e) =>
                  (formRef.current.docker_image = e.target.value)
                }
              />
            </FormControl>

            {/* Generate Configuration button */}
            <Button
              my="6"
              w="100%"
              colorScheme="brand"
              onClick={generateConfig}
              isLoading={isConfigurationGenerating}
              hidden={sourceType === "" || isConfigurationGenerated}
            >
              Generate Configuration
            </Button>
          </Box>
          {/* Dockerfile modal */}
          <Modal
            onClose={dockerfileModalDisclosure.onClose}
            size="full"
            isOpen={dockerfileModalDisclosure.isOpen}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>🐋 Dockerfile for {detectedServiceName}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Editor
                  height="75vh"
                  defaultLanguage="dockerfile"
                  defaultValue={editedDockerFile}
                  onChange={(v) => setEditedDockerFile(v)}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="brand"
                  mr={3}
                  onClick={generateCustomConfigFromDockerfile}
                  isLoading={generatingConfig}
                >
                  Update
                </Button>
                <Button
                  onClick={dockerfileModalDisclosure.onClose}
                  isDisabled={generatingConfig}
                >
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {/* Configuration section */}
          <Box w="25vw">
            {/* Generated Configuration */}
            {isConfigurationGenerated &&
              (sourceType === "git" || sourceType === "tarball") && (
                <>
                  <Text fontWeight="bold">
                    🏄 Detected Service Name: {detectedServiceName}
                  </Text>
                  <Button
                    w="100%"
                    mt="5"
                    mb="5"
                    colorScheme="brand"
                    onClick={openDockerfileEditModal}
                  >
                    View or Modify Dockerfile
                  </Button>
                </>
              )}
            {isConfigurationGenerated && sourceType === "image" && (
              <Text fontWeight="bold" mb="6">
                {detectedServiceName}
              </Text>
            )}

            {/* Form details */}
            {isConfigurationGenerated && Object.keys(buildArgs).length > 0 && (
              <>
                {Object.entries(buildArgs).map(([key, value]) => (
                  <FormControl key={key} isRequired mb="4">
                    <FormLabel>{value.description}</FormLabel>
                    <Input
                      defaultValue={value.default}
                      onChange={(e) =>
                        (formRef.current.build_args[key] = e.target.value)
                      }
                    />
                  </FormControl>
                ))}
              </>
            )}

            {/* Environment Variable Setup */}
            {isConfigurationGenerated && (
              <EnvironmentVariablesSetup
                environmentVariables={environmentVariables}
                setEnvironmentVariables={setEnvironmentVariables}
              />
            )}

            {/* Proceed button */}
            <Button
              w="100%"
              colorScheme="brand"
              onClick={handleProceed}
              hidden={!isConfigurationGenerated}
            >
              Procced
            </Button>
          </Box>
        </Flex>
      </Center>
    </>
  );
}
