import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
  Input,
  Select,
  Spacer,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
  useSteps,
} from "@chakra-ui/react";

import Logo from "../assets/images/logo-full-inverse.png";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";

const steps = [
  { title: "Administration", description: "Setup Account" },
  { title: "Database", description: "Setup Database" },
  { title: "Review", description: "Review details" },
  { title: "Submit", description: "Finalize Details" },
];

const databases = [
  { title: "SQLlite (Default)", slug: "sqlite" },
  { title: "MySQL", slug: "mysql" },
  { title: "PostgreSQL", slug: "postgresql" },
];

export default function SetupPage() {
  const { activeStep, activeStepPercent, goToNext, goToPrevious } = useSteps({
    index: 0,
    count: steps.length,
  });

  return (
    <Box
      w="100vw"
      minH="100vh"
      bg="brand.400"
      padding="16"
      display="flex"
      alignItems="center"
      flexDirection="column"
    >
      {/* Logo */}
      <Image src={Logo} alt="Logo" w="20%" h="auto" />
      {/* form */}
      <Box
        minW="60%"
        bg="white"
        mt="10"
        padding="8"
        borderRadius="xl"
        display="flex"
        alignItems="center"
        flexDirection="column"
      >
        {/* Setpper */}
        <Stepper index={activeStep} w="90%">
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>

              <Box flexShrink="0">
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>
        {/* Form */}
        <Box
          w="100%"
          h="100%"
          mt="8"
          display="flex"
          flexDirection="column"
          gap="3"
        >
          {/* Account Setup form */}
          {activeStep === 0 && (
            <>
              <FormControl>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  required
                />
                <FormHelperText>
                  This will be used to authentication, SSL generation and for
                  send updates of product
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>Full Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter full name of admin"
                  required
                />
              </FormControl>

              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter strong password"
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  required
                />
              </FormControl>
            </>
          )}

          {/* Database Setup form */}
          {activeStep === 1 && (
            <>
              <FormControl>
                <FormLabel>Database Type</FormLabel>
                <Select placeholder="Select database">
                  {databases.map((database, index) => (
                    <option key={database.slug} selected={index == 0}>
                      {database.title}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </>
          )}

          {/* Review details form */}
          {activeStep === 2 && (
            <Box>
              <Text fontWeight="semibold" fontSize="lg" pb="0">
                Review details
              </Text>
              <Text fontSize="sm">
                Please review the details below and click on proceed to next to
                continue
              </Text>
              <Divider my="4" />
              <Box>
                <Text fontWeight="semibold" fontSize="md">
                  Account Details
                </Text>
                <Text fontSize="sm">
                  Email:{" "}
                  <Text as="span" fontWeight="semibold">
                    test@test.complete
                  </Text>
                </Text>
                <Text fontSize="sm">
                  Full Name:{" "}
                  <Text as="span" fontWeight="semibold">
                    Test User
                  </Text>
                </Text>
              </Box>
            </Box>
          )}

          <Spacer />

          {/* Prev and next button */}
          <Box>
            <Button
              colorScheme="brand"
              variant="solid"
              onClick={goToPrevious}
              leftIcon={<ArrowBackIcon />}
              isDisabled={activeStepPercent === 0}
            >
              Go back
            </Button>
            <Button
              colorScheme="brand"
              variant="solid"
              float="right"
              onClick={goToNext}
              rightIcon={<ArrowForwardIcon />}
              display={activeStep === 2 ? "none" : "block"}
            >
              Proceed to Next
            </Button>
            <Button
              colorScheme="brand"
              variant="solid"
              float="right"
              display={activeStep === 2 ? "block" : "none"}
            >
              Begin Installation
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
