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
import ConfigureSourcePage from "./deploy_application/configure_source";
import ConfigureVolumePage from "./deploy_application/configure_volume";
import ReviewAndDeployPage from "./deploy_application/review_and_deploy";

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
      slug: "configure-volume",
      title: "Persistent Volume",
      subtitle: "Configure Volume",
      tooltip: "Configure Persistent Volume (Optional)",
    },
    {
      slug: "deploy-application",
      title: "Deploy Application",
      subtitle: "Final Step",
      tooltip: "Final Step",
    },
  ];
  const { activeStep, goToNext } = useSteps({
    index: 0,
    count: steps.length,
  });

  const formRef = useRef({
    service_name: "",
    source_type: "",
    git_credential_id: 0,
    repository_url: "",
    branch: "",
    tarball_file: "",
    dockerfile: "",
    docker_image: "",
    build_args: {},
    environment_variables: {},
    volumes: {},
    replicas: 1, // TODO: Add support for replicas
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
        <ServiceNameField
          context={context}
          toast={toast}
          activeStep={activeStep}
          formRef={formRef}
          goToNext={goToNext}
        />
        {/* Configure Source  */}
        <ConfigureSourcePage
          context={context}
          toast={toast}
          activeStep={activeStep}
          formRef={formRef}
          goToNext={goToNext}
        />
        {/* Configure Volume */}
        <ConfigureVolumePage
          context={context}
          toast={toast}
          activeStep={activeStep}
          formRef={formRef}
          goToNext={goToNext}
        />
        {/* Deploy Confirmation */}
        <ReviewAndDeployPage
          context={context}
          toast={toast}
          activeStep={activeStep}
          formRef={formRef}
        />
      </Box>
    </>
  );
}
