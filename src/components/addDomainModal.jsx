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

export default function AddDomainModal({ addDomain, onClose, isOpen }) {
  const [isAdding, setIsAdding] = useState(false);
  const domainFieldRef = useRef();

  const handleSubmission = async () => {
    setIsAdding(true);
    await addDomain({
      domain_name: domainFieldRef.current.value,
    });
    setIsAdding(false);
  };

  useEffect(() => {
    // reset form
    if (domainFieldRef.current) {
      domainFieldRef.current.value = "";
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
