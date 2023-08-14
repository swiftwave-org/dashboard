/* eslint-disable react/no-unknown-property */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { Box, Button, Center, Divider, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../utils";

export default function ReviewAndDeployPage({
  context,
  toast,
  activeStep,
  formRef,
}) {
  const navigate = useNavigate();
  const [isDeploying, setIsDeploying] = useState(false);

  const cancelDeploy = () => {
    const conf = confirm("Are you sure you want to cancel deployment?");
    if (conf) {
      navigate("/application");
    }
  };

  const deployApp = async () => {
    setIsDeploying(true);
    const res = await context.applications.deployApplication(formRef.current);
    if (res.status) {
      showSuccessToast(toast, res.message);
      navigate("/application");
    } else {
      showErrorToast(toast, res.message);
    }
    setIsDeploying(false);
  };

  return (
    <Center hidden={activeStep !== 3}>
      <Box w="25vw" display="flex" flexDirection="column" alignItems="center">
        <Text fontSize="2xl" fontWeight="bold">
          Confirm and Deploy
        </Text>
        <Text fontSize="lg" fontWeight="bold" mt="4">
          Application {formRef.current.service_name}
        </Text>
        <Divider mt="2" mb="8" />
        <Flex w="100%" gap="10px">
          <Button
            w="100%"
            colorScheme="red"
            onClick={cancelDeploy}
            disabled={isDeploying}
          >
            Cancel Deployment
          </Button>
          <Button
            colorScheme="brand"
            w="100%"
            onClick={deployApp}
            disabled={isDeploying}
            isLoading={isDeploying}
          >
            Deploy App
          </Button>
        </Flex>
      </Box>
    </Center>
  );
}
