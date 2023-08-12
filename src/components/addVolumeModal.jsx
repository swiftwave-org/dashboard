/* eslint-disable react/prop-types */
import {
  Button,
  FormControl,
  FormHelperText,
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

export default function AddVolumeModal({ addVolume, onClose, isOpen }) {
  const [isAdding, setIsAdding] = useState(false);
  const volumeFieldRef = useRef();

  const handleSubmission = async () => {
    setIsAdding(true);
    await addVolume({
      name: volumeFieldRef.current.value,
    });
    setIsAdding(false);
  };

  useEffect(() => {
    // reset form
    if (volumeFieldRef.current) {
      volumeFieldRef.current.value = "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Persistent Volume</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Volume Name</FormLabel>
            <Input placeholder="Enter volume name" ref={volumeFieldRef} />
            <FormHelperText>Only letters, numbers and underscore is allowed</FormHelperText>
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
