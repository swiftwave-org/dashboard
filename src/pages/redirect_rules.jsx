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
import AddRedirectRulesModal from "../components/addRedirectRulesModal";

export default function RedirectRulesPage() {
  const controller = useContext(ControllerContext);
  const toast = useToast();
  const [rules, setRules] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // add modal disclosure
  const addModalDisclosure = useDisclosure();

  const fetchRules = async () => {
    setIsRefreshing(true);
    const res = await controller.redirect_rules.fetchAll();
    if (res.status) {
      setRules(res.data);
    } else {
      showErrorToast(toast, res.message);
    }
    setIsRefreshing(false);
  };

  const deleteRule = async (id) => {
    const res = confirm("Are you sure you want to delete this rule?");
    if (res) {
      const res = await controller.redirect_rules.delete(id);
      if (res.status) {
        showSuccessToast(toast, res.message);
        fetchRules();
      } else {
        showErrorToast(toast, res.message);
      }
    }
  };

  const addRule = async ({ port, domain_name, redirect_url }) => {
    const res = await controller.redirect_rules.add(
      port,
      domain_name,
      redirect_url
    );
    if (res.status) {
      showSuccessToast(toast, res.message);
      fetchRules();
      addModalDisclosure.onClose();
    } else {
      showErrorToast(toast, res.message);
    }
  };

  useEffect(() => {
    fetchRules();
    setInterval(() => {
      fetchRules();
    }, 10000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box p="10">
        <AddRedirectRulesModal
          addRule={addRule}
          isOpen={addModalDisclosure.isOpen}
          onClose={addModalDisclosure.onClose}
        />

        <Card mb="10" p="0">
          <CardBody>
            <Flex justifyContent="space-between">
              <Heading as="h2" size="md">
                URL Redirect Rules
              </Heading>
              <Box>
                <Button size="sm" isLoading={isRefreshing} onClick={fetchRules}>
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

        {rules.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            py="40"
          >
            <Text fontSize="18px" mt={3} mb={2}>
              No Redirect Rules Found
            </Text>
            <Text color={"gray.500"} mb={6}>
              Add a new rule to redirect your domain to a different URL.
            </Text>

            <Button
              colorScheme="brand"
              w="fit-content"
              variant="solid"
              onClick={addModalDisclosure.onOpen}
            >
              Add Redirect Rule
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table variant="simple" colorScheme="brand">
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Domain</Th>
                  <Th>Redirect To</Th>
                  <Th>Staus</Th>
                  <Th>Last Update</Th>
                  <Th>Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {rules.map((rule, index) => {
                  return (
                    <Tr key={index}>
                      <Td>{rule.id}</Td>
                      <Td>
                        http://{rule.domain_name}:{rule.port}
                      </Td>
                      <Td>{rule.redirect_url}</Td>
                      <Td>
                        <Tag
                          size="md"
                          key="md"
                          variant="solid"
                          colorScheme={tag_color[rule.status]}
                          fontWeight="bold"
                          borderRadius="full"
                          style={{
                            textTransform: "uppercase",
                          }}
                        >
                          {rule.status}
                        </Tag>
                      </Td>
                      <Td>{formatReadableDate(rule.updated_at)}</Td>
                      <Td>
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() => deleteRule(rule.id)}
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
                  <Th>Domain</Th>
                  <Th>Redirect To</Th>
                  <Th>Staus</Th>
                  <Th>Last Update</Th>
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
