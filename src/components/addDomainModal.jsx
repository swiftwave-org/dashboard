/* eslint-disable react/prop-types */
import {
  Alert,
  AlertIcon,
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

export default function AddDomainModal({ addDomain, verifyDomain, onClose, isOpen }) {
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const domainFieldRef = useRef();

  const handleSubmission = async () => {
    setErrorMessage("");
    setIsAdding(true);
    const isPointing = await verifyDomain({
      domain_name: domainFieldRef.current.value,
    })
    if(isPointing === false){
      setErrorMessage(`${domainFieldRef.current.value} is not ponting to your server.\n Update DNS Configuration to fix`);
    } else {
      setErrorMessage("");
      await addDomain({
        domain_name: domainFieldRef.current.value,
      });
    }    
    setIsAdding(false);
  };

  useEffect(() => {
    // reset form
    if (domainFieldRef.current) {
      domainFieldRef.current.value = "";
      setErrorMessage("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Domain</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Domain</FormLabel>
            <Input placeholder="Enter domain" ref={domainFieldRef} />
          </FormControl>
          <Alert status="warning" mt="2" rounded="md" hidden={errorMessage === ""}>
            <AlertIcon />
            <p style={{
              whiteSpace: "pre-line"
            }}>
            {errorMessage}
            </p>
          </Alert>
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
