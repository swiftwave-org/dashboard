/* eslint-disable react/prop-types */
import {
  Box,
  Button,
  Center,
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
  Select,
  Text,
} from "@chakra-ui/react";
import { ArrowDownIcon } from "@primer/octicons-react";
import { useContext, useEffect, useRef, useState } from "react";
import ControllerContext from "../context/controller/ControllerContext";

export default function AddRedirectRulesModal({ addRule, onClose, isOpen }) {
  const controllerContext = useContext(ControllerContext);
  const [isAdding, setIsAdding] = useState(false);
  const [domains, setDomains] = useState([]);
  const domainFieldRef = useRef();
  const portFieldRef = useRef();
  const redirectUrlFieldRef = useRef();

  const handleSubmission = async() => {
    setIsAdding(true);
    await addRule({
      port: portFieldRef.current.value,
      domain_name: domainFieldRef.current.value,
      redirect_url: redirectUrlFieldRef.current.value,
    });
    setIsAdding(false);
  }

  const fetchDomains = async () => {
    const res = await controllerContext.domains.fetchNames();
    if (res.status) {
      setDomains(res.data);
    } else {
      console.log(res.message);
    }
  }

  useEffect(() => {
    // reset form
    if(domainFieldRef.current && portFieldRef.current && redirectUrlFieldRef.current){
      domainFieldRef.current.value = "";
      // portFieldRef.current.value = "";
      redirectUrlFieldRef.current.value = "";
    }
    fetchDomains();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Redirection Rule</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Box display="grid" gridTemplateColumns="3fr 1fr" gap="5">
            <FormControl>
              <FormLabel>Domain</FormLabel>
              <Select ref={domainFieldRef} defaultValue="dummy">
                <option disabled value="dummy">Select Domain</option>
                {domains.map((domain) => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Port</FormLabel>
              <Input placeholder="port" ref={portFieldRef} defaultValue="80" disabled />
            </FormControl>
          </Box>
          <Text fontSize="sm" mt="5"><b>Note :</b> Currently supports only port 80</Text>

          <Center pt="3">
            <Icon as={ArrowDownIcon} fontSize="4xl" color="brand.800"></Icon>
          </Center>

          <FormControl>
            <FormLabel>Redirect URL</FormLabel>
            <Input placeholder="Redirect URL" ref={redirectUrlFieldRef} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="brand" mr={3} onClick={handleSubmission} isLoading={isAdding} isDisabled={isAdding}>
            Create
          </Button>
          <Button onClick={onClose} isDisabled={isAdding}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
