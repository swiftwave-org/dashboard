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
  useToast,
} from "@chakra-ui/react";
import { ChevronRightIcon, SyncIcon } from "@primer/octicons-react";
import { useContext, useEffect, useState } from "react";
import ControllerContext from "../context/controller/ControllerContext";
import { showErrorToast } from "../utils";
import tag_color from "../config/tag_color";
import { useNavigate } from "react-router-dom";

export default function DeployedApplicationManagementPage() {
  const controller = useContext(ControllerContext);
  const toast = useToast();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchApplicationsSummary = async () => {
    setIsRefreshing(true);
    const res = await controller.applications.fetchApplicationsSummary();
    if (res.status) {
      setApplications(res.data);
    } else {
      showErrorToast(toast, res.message);
    }
    setIsRefreshing(false);
  };

  const viewApplicationDetails = (id) => {
    navigate(`/application/${id}`);
  };

  const deployNewApplication = () => {
    navigate("/application/deploy");
  }

  useEffect(() => {
    fetchApplicationsSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box p="10">
        <Card mb="10" p="0">
          <CardBody>
            <Flex justifyContent="space-between">
              <Heading as="h2" size="md">
                Deployed Applications
              </Heading>
              <Box>
                <Button
                  size="sm"
                  isLoading={isRefreshing}
                  onClick={fetchApplicationsSummary}
                >
                  <Icon as={SyncIcon} mr="2" />
                  Refresh
                </Button>
              </Box>
            </Flex>
          </CardBody>
        </Card>

        {applications.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            py="40"
          >
            <Text fontSize="18px" mt={3} mb={2}>
              No Deployed Applications Found
            </Text>
            <Text color={"gray.500"} mb={6}>
              Deploy your application within minutes 🔥
            </Text>

            <Button colorScheme="brand" w="fit-content" variant="solid" onClick={deployNewApplication}>
              Deploy Application
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table variant="simple" colorScheme="brand">
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Service Name</Th>
                  <Th>Source</Th>
                  <Th>Replicas</Th>
                  <Th>Status</Th>
                  <Th>View</Th>
                </Tr>
              </Thead>
              <Tbody>
                {applications.map((app, index) => {
                  return (
                    <Tr key={index}>
                      <Td>{app.id}</Td>
                      <Td>{app.service_name}</Td>
                      <Td>{app.source}</Td>
                      <Td>{app.replicas}</Td>
                      <Td>
                        <Tag
                          size="md"
                          key="md"
                          variant="solid"
                          colorScheme={tag_color[app.status]}
                          fontWeight="bold"
                          borderRadius="full"
                          style={{
                            textTransform: "uppercase",
                          }}
                        >
                          {app.status}
                        </Tag>
                      </Td>
                      <Td>
                        <Button
                          size="sm"
                          onClick={() => viewApplicationDetails(app.id)}
                        >
                          View Details
                          <Icon ml="2" as={ChevronRightIcon} />
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>#</Th>
                  <Th>Service Name</Th>
                  <Th>Source</Th>
                  <Th>Replicas</Th>
                  <Th>Status</Th>
                  <Th>View</Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        )}
      </Box>
    </>
  );
}
