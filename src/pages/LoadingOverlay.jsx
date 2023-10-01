import { Flex, Spinner, Box } from "@chakra-ui/react";
import LoadingImage from "../assets/images/loading.png"; 

const LoadingOverlay = () => {
  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      justify="center"
      align="center"
      bg="rgba(255, 255, 255, 0.8)" 
      zIndex="9999"
      direction="column" 
    >
      <Box>
        <img src={LoadingImage} alt="Loading Image" width="48" height="48" />
      </Box>
      <Box mt="2">
        <Spinner size="xl" />
      </Box>
    </Flex>
  );
};

export default LoadingOverlay;
