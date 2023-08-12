import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { useContext, useRef } from "react";
import ConfigContext from "../context/config/configContext";

export function ServerConfig() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const configContext = useContext(ConfigContext);
  const host = configContext.state.server.host;
  const port = configContext.state.server.port;

  const formDetails = useRef({
    host: "",
    port: "",
  });

  function openModal() {
    formDetails.host = host;
    formDetails.port = port;
    onOpen();
  }

  function handleSubmission() {
    if(formDetails.host === "" || formDetails.port === "") {
      toast({
        title: "Error",
        descrhosttion: "Please fill all the fields",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    configContext.setServer(formDetails.host, formDetails.port);
    onClose();
  }

  return (
    <>
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        display="flex"
        justifyContent="center"
      >
        <Flex
          boxShadow="lg"
          p="2"
          m="0"
          bgColor="brand.800"
          color="white"
          borderRadius="lg"
          borderBottomRadius="0"
          gap="15px"
          align="center"
        >
          {configContext.isSet() ? (
            <Text>
              &nbsp;&nbsp;Connected to{" "}
              <b>
                {host}:{port}
              </b>
            </Text>
          ) : (
            <Text>&nbsp;&nbsp;No Server Configured</Text>
          )}
          <Button colorScheme="whiteAlpha" size="sm" onClick={openModal}>
            <Icon as={EditIcon} mr="1" /> Update
          </Button>
        </Flex>
      </Box>

      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Server Config</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex gap="3">
              <FormControl>
                <FormLabel>Public host</FormLabel>
                <Input
                  placeholder="host of server"
                  type="text"
                  defaultValue={formDetails.host}
                  onChange={(e) => (formDetails.host = e.target.value)}
                />
              </FormControl>
              <FormControl w="50%">
                <FormLabel>Port</FormLabel>
                <Input
                  placeholder="PORT"
                  type="number"
                  defaultValue={formDetails.port}
                  onChange={(e) => (formDetails.port = e.target.value)}
                />
              </FormControl>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="brand" w="100%" onClick={handleSubmission}>
              Update Info
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
