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
import { useSelector, useDispatch } from "react-redux";
import { setSeverConfig } from "../redux/features/config/configSlice";
import { useRef } from "react";

export function ServerConfig() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const toast = useToast();

  const isSet = useSelector((state) => state.config.server.set);
  const ip = useSelector((state) => state.config.server.ip);
  const port = useSelector((state) => state.config.server.port);
  const formDetails = useRef({
    ip: "",
    port: "",
  });

  function openModal() {
    formDetails.ip = ip;
    formDetails.port = port;
    onOpen();
  }

  function handleSubmission() {
    if(formDetails.ip === "" || formDetails.port === "") {
      toast({
        title: "Error",
        description: "Please fill all the fields",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    dispatch(setSeverConfig(formDetails));
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
          {isSet ? (
            <Text>
              &nbsp;&nbsp;Connected to{" "}
              <b>
                {ip}:{port}
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
                <FormLabel>Public IP</FormLabel>
                <Input
                  placeholder="IP of server"
                  type="text"
                  defaultValue={formDetails.ip}
                  onChange={(e) => (formDetails.ip = e.target.value)}
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
