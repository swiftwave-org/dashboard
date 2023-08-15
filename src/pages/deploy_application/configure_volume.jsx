/* eslint-disable react/no-unknown-property */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import {
  Alert,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Input,
  Link,
  Select,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { showErrorToast } from "../../utils";

export default function ConfigureVolumePage({
  context,
  toast,
  activeStep,
  formRef,
  goToNext,
}) {
  const [availableVolumes, setAvailableVolumes] = useState([]);
  const [configuredVolumes, setConfiguredVolumes] = useState([]);

  const addNewVolume = () => {
    const newVolume = {
      name: "",
      mount_path: "",
    };
    setConfiguredVolumes([...configuredVolumes, newVolume]);
  };

  const removeVolume = (index) => {
    const newVolumes = configuredVolumes.filter((_, i) => i !== index);
    setConfiguredVolumes(newVolumes);
  };

  const handleVolumeNameChange = (index, e) => {
    const newVolumes = [...configuredVolumes];
    newVolumes[index].name = e.target.value;
    setConfiguredVolumes(newVolumes);
  };

  const handleVolumeMountPathChange = (index, e) => {
    const newVolumes = [...configuredVolumes];
    newVolumes[index].mount_path = e.target.value;
    setConfiguredVolumes(newVolumes);
  };

  const loadVolumes = async () => {
    const res = await context.volumes.fetchAll();
    if (res.status === false) {
      showErrorToast(toast, "Failed to load volumes");
      return;
    }
    setAvailableVolumes(res.data);
  };

  const handleProceed = () => {
    let tmp = {};
    for (const volume of configuredVolumes) {
      tmp[volume.name] = volume.mount_path;
      if (volume.name === "" || volume.mount_path === "") {
        showErrorToast(toast, "Please fill all the fields");
        return;
      }
    }
    formRef.current.volumes = tmp;
    goToNext();
  };

  useEffect(() => {
    loadVolumes();
  }, []);

  return (
    <Center hidden={activeStep !== 2}>
      <Box w="25vw" display="flex" flexDirection="column" alignItems="center">
        <Text fontSize="2xl">Configure Persistent Volume</Text>
        <Text fontSize="md" color="gray.500">
          Configure Persistent Volume (Optional)
        </Text>
        <Divider my="5" />

        <Alert status="warning" variant="subtle" borderRadius="md" mb="10px">
          <Box>
            1. If you want to add a new volume, please add it here first{" "}
            <Link
              href="/volume"
              target="_blank"
              color="blue.600"
              fontWeight="extrabold"
            >
              Volumes
            </Link>
            <br></br>
            2. Click here to{" "}
            <Link
              href="#"
              color="blue.600"
              fontWeight="extrabold"
              onClick={loadVolumes}
            >
              Refresh Volumes
            </Link>
          </Box>
        </Alert>

        {/* Add new volume button */}
        <Button onClick={addNewVolume} mb="5" w="100%">
          Configure New Volume
        </Button>

        {/* Configured Volumes  */}
        <Box my="5px">
          {configuredVolumes.map((configuredVolumes, index) => (
            <Flex key={index} gap="10px" mb="8px">
              <Input
                placeholder="Mount Path"
                value={configuredVolumes.mount_path}
                onChange={(e) => handleVolumeMountPathChange(index, e)}
              />
              <Select
                placeholder="Select option"
                value={configuredVolumes.name}
                onChange={(e) => handleVolumeNameChange(index, e)}
              >
                {availableVolumes.map((volume) => (
                  <option key={volume} value={volume}>
                    {volume}
                  </option>
                ))}
              </Select>
              <Button
                colorScheme="red"
                w="40%"
                onClick={() => removeVolume(index)}
              >
                Remove
              </Button>
            </Flex>
          ))}
        </Box>

        {/* Proceed button */}
        <Button w="100%" colorScheme="brand" onClick={handleProceed}>
          Proceed
        </Button>
      </Box>
    </Center>
  );
}
