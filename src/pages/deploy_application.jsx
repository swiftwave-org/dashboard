import {
  Box,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Tooltip,
  useSteps,
  useToast,
} from "@chakra-ui/react";
import { useContext, useRef } from "react";
import ControllerContext from "../context/controller/ControllerContext";
import ServiceNameField from "./deploy_application/service_name";

export default function DeployApplicationPage() {
  const context = useContext(ControllerContext);
  const toast = useToast();
  const steps = [
    {
      slug: "service-name",
      title: "Service Name",
      subtitle: "Unique Name",
      tooltip: "Globally Unique",
    },
    {
      slug: "configure-source",
      title: "Configure Source",
      subtitle: "Code Upload / Git / Image",
      tooltip: "Git, Source Code, Docker Image Supported",
    },
    {
      slug: "configure-environment",
      title: "Environment Variable",
      subtitle: "Modify & Add",
      tooltip: "Customize Environment Variable (Optional)",
    },
    {
      slug: "configure-network",
      title: "Deploy",
      subtitle: "Review and Deploy",
      tooltip: "Review and Deploy",
    },
  ];
  const { activeStep, goToNext } = useSteps({
    index: 0,
    count: steps.length,
  });

  const formRef = useRef({
    serviceName: "",
  });



  return (
    <>
      <Box p="20">
        <Stepper index={activeStep} mb="20">
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>
              <Tooltip label={step.tooltip} placement="top">
                <Box flexShrink="0">
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.subtitle}</StepDescription>
                </Box>
              </Tooltip>
              <StepSeparator />
            </Step>
          ))}
        </Stepper>
        {/* Service name */}
        <ServiceNameField context={context} toast={toast} activeStep={activeStep} formRef={formRef} goToNext={goToNext} />
      </Box>
    </>
  );
}
