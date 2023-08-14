/* eslint-disable react/prop-types */
import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
} from "@chakra-ui/react";
import { CheckCircleFillIcon } from "@primer/octicons-react";
import { showErrorToast } from "../../utils";
import { useRef, useState } from "react";

export default function ServiceNameField({
  context,
  toast,
  activeStep,
  formRef,
  goToNext,
}) {
  // -1 -> not checked, 0 -> not available, 1 -> available, 2 -> checking
  const [serviceNameStatus, setServiceNameStatus] = useState(true);
  const timeoutRef = useRef(null);

  const handleServiceNameChange = async (e) => {
    const serviceName = e.target.value;
    if (serviceName.length === 0) {
      setServiceNameStatus(-1);
    } else {
      setServiceNameStatus(2);
      timeoutRef && clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(async () => {
        const res = await context.applications.checkServiceNameAvailability(
          serviceName
        );
        if (res.status === false) {
          showErrorToast(toast, "Failed to check service name availability");
          setServiceNameStatus(-1);
          return;
        } else {
          formRef.current.serviceName = serviceName;
          if (res.available === false) {
            console.log("not available");
            setServiceNameStatus(0);
          } else {
            setServiceNameStatus(1);
          }
        }
      }, 500);
    }
  };

  return (
    <Center hidden={activeStep !== 0}>
      <Box w="25vw">
        <FormControl mb="5" isRequired isInvalid={serviceNameStatus === 0}>
          <FormLabel>Service Name</FormLabel>
          <Input
            placeholder="Enter unique service name"
            onInput={handleServiceNameChange}
            pattern="^[a-z0-9-]+$"
          />
          <FormErrorMessage>
            <FormErrorIcon />
            {formRef.current.serviceName + " is not available"}
          </FormErrorMessage>
          {serviceNameStatus === 1 && (
            <FormHelperText color="green">
              <Icon as={CheckCircleFillIcon} color="green.500" mr="1" />
              {formRef.current.serviceName + " is available"}
            </FormHelperText>
          )}
        </FormControl>
        <Button
          w="100%"
          colorScheme="brand"
          isLoading={serviceNameStatus === 2}
          isDisabled={serviceNameStatus !== 1}
          onClick={goToNext}
        >
          Proceed{" "}
        </Button>
      </Box>
    </Center>
  );
}
