import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Icon,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { SyncIcon } from "@primer/octicons-react";
import { useContext, useEffect, useState } from "react";
import ControllerContext from "../context/controller/ControllerContext";
import { formatReadableDate, showErrorToast, showSuccessToast } from "../utils";
import tag_color from "../config/tag_color";
import { AddIcon } from "@chakra-ui/icons";
import AddDomainModal from "../components/addDomainModal";
import SSLCertificateModal from "../components/SSLCertificateModal";

export default function DomailManagementPage() {
  const controller = useContext(ControllerContext);
  const toast = useToast();
  const [domains, setDomains] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const [fullchain, setFullchain] = useState("");

  // add modal disclosure
  const addModalDisclosure = useDisclosure();
  // show SSL certificate modal
  const sslCertificateModalDisclosure = useDisclosure();

  const fetchDomains = async () => {
    setIsRefreshing(true);
    const res = await controller.domains.fetchAll();
    if (res.status) {
      setDomains(res.data);
    } else {
      showErrorToast(toast, res.message);
    }
    setIsRefreshing(false);
  };

  const deleteDomain = async (id) => {
    const res = confirm("Are you sure you want to delete domain ?");
    if (res) {
      const res = await controller.domains.delete(id);
      if (res.status) {
        showSuccessToast(toast, res.message);
        fetchDomains();
      } else {
        showErrorToast(toast, res.message);
      }
    }
  };

  const issueSSL = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to issue SSL ?\nNOTE: make sure to remove ingress rule for this domain"
    );
    if (!confirm) {
      return;
    }
    const res = await controller.domains.issueSSL(id);
    if (res.status) {
      showSuccessToast(toast, res.message);
      fetchDomains();
    } else {
      showErrorToast(toast, res.message);
    }
  };

  const addDomain = async ({ domain_name }) => {
    const res = await controller.domains.add(domain_name);
    if (res.status) {
      showSuccessToast(toast, res.message);
      fetchDomains();
      addModalDisclosure.onClose();
    } else {
      showErrorToast(toast, res.message);
    }
  };

  const verifyDomain = async ({ domain_name }) => {
    const res = await controller.domains.verifyDomainNameReachibility(domain_name);
    if (res.status) {
      return true;
    } else {
      showErrorToast(toast, res.message);
      return false;
    }
  };

  const showSSLDetails = (fullchain, privateKey) => {
    setPrivateKey(privateKey);
    setFullchain(fullchain);
    sslCertificateModalDisclosure.onOpen();
  }

  useEffect(() => {
    fetchDomains();
    setInterval(() => {
      fetchDomains();
    }, 10000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box p="10">
        <SSLCertificateModal
          fullchain={fullchain}
          privateKey={privateKey}
          isOpen={sslCertificateModalDisclosure.isOpen}
          onClose={sslCertificateModalDisclosure.onClose}
        />
        <AddDomainModal
          addDomain={addDomain}
          verifyDomain={verifyDomain}
          isOpen={addModalDisclosure.isOpen}
          onClose={addModalDisclosure.onClose}
        />

        <Card mb="10" p="0">
          <CardBody>
            <Flex justifyContent="space-between">
              <Heading as="h2" size="md">
                Domain Management
              </Heading>
              <Box>
                <Button
                  size="sm"
                  isLoading={isRefreshing}
                  onClick={fetchDomains}
                >
                  <Icon as={SyncIcon} mr="2" />
                  Refresh 
                </Button>{" "}
                <Button
                  colorScheme="brand"
                  size="sm"
                  onClick={addModalDisclosure.onOpen}
                >
                  <Icon as={AddIcon} mr="2" />
                  Add
                </Button>
              </Box>
            </Flex>
          </CardBody>
        </Card>

        {domains.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            py="40"
          >
            <Text fontSize="18px" mt={3} mb={2}>
              No Domains Found
            </Text>
            <Text color={"gray.500"} mb={6}>
              Add a domain to expose your application to the internet
            </Text>

            <Button
              colorScheme="brand"
              w="fit-content"
              variant="solid"
              onClick={addModalDisclosure.onOpen}
            >
              Add Domain
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table variant="simple" colorScheme="brand">
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Name</Th>
                  <Th>SSL Issue</Th>
                  <Th>SSL Status</Th>
                  <Th>SSL Issuer</Th>
                  <Th>SSL Issued At</Th>
                  <Th>Certificate</Th>
                  <Th>Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {domains.map((rule, index) => {
                  return (
                    <Tr key={index}>
                      <Td>{rule.id}</Td>
                      <Td>{rule.name}</Td>
                      <Td>
                        <Button size="sm" onClick={() => issueSSL(rule.id)}>
                          Issue SSL
                        </Button>
                      </Td>
                      <Td>
                        <Tag
                          size="md"
                          key="md"
                          variant="solid"
                          colorScheme={tag_color[rule.ssl_status]}
                          fontWeight="bold"
                          borderRadius="full"
                          style={{
                            textTransform: "uppercase",
                          }}
                        >
                          {rule.ssl_status === "none"
                            ? "No Request"
                            : rule.ssl_status}
                        </Tag>
                      </Td>
                      <Td>
                        {rule.ssl_status === "issued" ? rule.ssl_issuer : "-"}
                      </Td>
                      <Td>
                        {rule.ssl_status === "issued"
                          ? formatReadableDate(rule.ssl_issued_at)
                          : "-"}
                      </Td>
                      <Td>
                        <Button size="sm" onClick={() => showSSLDetails(rule.ssl_full_chain, rule.ssl_private_key)} isDisabled={rule.ssl_status !== "issued"}>
                          View Certificate
                        </Button>
                      </Td>
                      <Td>
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() => deleteDomain(rule.id)}
                        >
                          Delete
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>#</Th>
                  <Th>Name</Th>
                  <Th>SSL Issue</Th>
                  <Th>SSL Status</Th>
                  <Th>SSL Issuer</Th>
                  <Th>SSL Issued At</Th>
                  <Th>Certificate</Th>
                  <Th>Delete</Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        )}
      </Box>
    </>
  );
}
