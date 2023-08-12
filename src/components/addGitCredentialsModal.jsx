/* eslint-disable react/prop-types */
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

export default function AddGitCredentialsModal({
  addGitCredential,
  onClose,
  isOpen,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const nameFieldRef = useRef();
  const usernameFieldRef = useRef();
  const passwordFieldRef = useRef();

  const handleSubmission = async () => {
    setIsAdding(true);
    await addGitCredential({
      name: nameFieldRef.current.value,
      username: usernameFieldRef.current.value,
      password: passwordFieldRef.current.value,
    });
    setIsAdding(false);
  };

  useEffect(() => {
    // reset form
    if (
      usernameFieldRef.current &&
      nameFieldRef.current &&
      passwordFieldRef.current
    ) {
      usernameFieldRef.current.value = "";
      nameFieldRef.current.value = "";
      passwordFieldRef.current.value = "";
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Git Credentials</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl isRequired mb={6}>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Enter name to identify"
              ref={nameFieldRef}
            />
          </FormControl>
          <FormControl isRequired mb={6}>
            <FormLabel aria-required>Username</FormLabel>
            <Input
              placeholder="Enter git username"
              ref={usernameFieldRef}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password or Personal Token</FormLabel>
            <Input
              placeholder="Enter your password or personal token"
              ref={passwordFieldRef}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="brand"
            mr={3}
            onClick={handleSubmission}
            isLoading={isAdding}
            isDisabled={isAdding}
          >
            Create
          </Button>
          <Button onClick={onClose} isDisabled={isAdding}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
