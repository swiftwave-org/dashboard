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
  useDisclosure,
} from "@chakra-ui/react";

export function ServerConfig() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  

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
          <Text>
            &nbsp;&nbsp;Connected to <b>127.0.0.1:3000</b>
          </Text>
          <Button colorScheme="whiteAlpha" size="sm" onClick={onOpen}>
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
                <Input placeholder="IP of server" type="text" />
              </FormControl>
              <FormControl w="50%">
                <FormLabel>Port</FormLabel>
                <Input placeholder="PORT" type="number" />
              </FormControl>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="brand" onClick={onClose} w="100%">
              Update Info
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
