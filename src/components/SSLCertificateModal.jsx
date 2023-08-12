/* eslint-disable react/prop-types */

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
} from "@chakra-ui/react";

export default function SSLCertificateModal({
  isOpen,
  onClose,
  privateKey,
  fullchain,
}) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxW="40vw">
          <ModalHeader>SSL Certificate</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>Private Key</Text>
            <Textarea mb={6} height={500} variant="filled" readOnly>
              {privateKey}
            </Textarea>
            <Text>Fullchain</Text>
            <Textarea height={500}>
              {fullchain}
            </Textarea>

          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
