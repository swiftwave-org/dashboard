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
} from "@chakra-ui/react";
import { ArrowDownIcon } from "@primer/octicons-react";
import { useContext, useEffect, useRef, useState } from "react";
import ControllerContext from "../context/controller/ControllerContext";

export default function AddIngressRulesModal({ addRule, onClose, isOpen }) {
  const controllerContext = useContext(ControllerContext);
  const [isAdding, setIsAdding] = useState(false);
  const [domains, setDomains] = useState([]);
  const [services, setServices] = useState([]);
  const [protocol, setProtocol] = useState("http");
  const protocolFieldRef = useRef();
  const domainFieldRef = useRef();
  const ingressPortFieldRef = useRef();
  const serviceNameFieldRef = useRef();
  const servicePortFieldRef = useRef();
  
  const handleSubmission = async() => {
    setIsAdding(true);
    await addRule({
      protocol: protocolFieldRef.current.value,
      domain_name: domainFieldRef.current.value,
      port: ingressPortFieldRef.current ? ingressPortFieldRef.current.value : "",
      service_name: serviceNameFieldRef.current.value, 
      service_port: servicePortFieldRef.current.value
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

  const fetchServiceNames = async () => {
    const res = await controllerContext.applications.fetchNames();
    if (res.status) {
      setServices(res.data);
    } else {
      console.log(res.message);
    }
  }

  useEffect(() => {
    // reset form
    if(domainFieldRef.current){
      protocolFieldRef.current.value = "http";
      domainFieldRef.current.value = "";
      serviceNameFieldRef.current.value = "";
      servicePortFieldRef.current.value = "";
      if(ingressPortFieldRef.current) ingressPortFieldRef.current.value = "80";
    }
    fetchDomains();
    fetchServiceNames();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Ingress Rule</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Box display="grid" gridTemplateColumns="1fr 3fr" gap="5" pb={4}>
            <FormControl>
              <FormLabel>Protocol</FormLabel>
              <Select defaultValue="http"  onChange={e => {
                setProtocol(e.target.value);
                if(e.target.value === "http"){
                  ingressPortFieldRef.current.value = "80";
                }
              }} ref={protocolFieldRef}>
                <option value="http">http</option>
                <option value="https">https</option>
                <option value="tcp">tcp</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Domain</FormLabel>
              <Select defaultValue="dummy" ref={domainFieldRef}>
                <option disabled value="dummy">Select Domain</option>
                {domains.map((domain) => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </Select>
            </FormControl>
          </Box>

          <FormControl hidden={protocol === "https"}>
            <FormLabel>Enter Port No</FormLabel>
            <Input placeholder="Enter Ingress Port" ref={ingressPortFieldRef} defaultValue={80} />
          </FormControl>

          <Center pt="3">
            <Icon as={ArrowDownIcon} fontSize="4xl" color="brand.800"></Icon>
          </Center>

          <Box display="grid" gridTemplateColumns="3fr 1fr" gap="5">
            <FormControl>
              <FormLabel>Service Name</FormLabel>
              <Select defaultValue="dummy" ref={serviceNameFieldRef}>
                <option disabled value="dummy">Select Service</option>
                {services.map((service) => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Port</FormLabel>
              <Input placeholder="port" ref={servicePortFieldRef} />
            </FormControl>
          </Box>
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
