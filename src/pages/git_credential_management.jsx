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
import { EyeClosedIcon, EyeIcon, SyncIcon } from "@primer/octicons-react";
import { useContext, useEffect, useState } from "react";
import ControllerContext from "../context/controller/ControllerContext";
import { showErrorToast, showSuccessToast, runTaskAtInterval } from "../utils";
import { AddIcon } from "@chakra-ui/icons";
import AddGitCredentialsModal from "../components/addGitCredentialsModal";

export default function GitCredentialManagementPage() {
  const controller = useContext(ControllerContext);
  const toast = useToast();
  const [credentials, setCredentials] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showPasswordId, setShowPasswordId] = useState(-1);

  // add modal disclosure
  const addModalDisclosure = useDisclosure();

  const fetchGitCredentials = async () => {
    setIsRefreshing(true);
    const res = await controller.git_credentials.fetchAll();
    if (res.status) {
      setCredentials(res.data);
    } else {
      showErrorToast(toast, res.message);
    }
    setIsRefreshing(false);
  };

  const deleteGitCredential = async (id) => {
    const res = confirm("Are you sure you want to delete this git credential ?");
    if (res) {
      const res = await controller.git_credentials.delete(id);
      if (res.status) {
        showSuccessToast(toast, res.message);
        fetchGitCredentials();
      } else {
        showErrorToast(toast, res.message);
      }
    }
  };

  const addGitCredential = async ({ name, username, password }) => {
    const res = await controller.git_credentials.add(
      name,
      username,
      password
    );
    if (res.status) {
      showSuccessToast(toast, res.message);
      fetchGitCredentials();
      addModalDisclosure.onClose();
    } else {
      showErrorToast(toast, res.message);
    }
  };

  const toggleShowPassword = (index) => {
    if (showPasswordId === index) {
      setShowPasswordId(-1);
    } else {
      setShowPasswordId(index);
    }
  }

  useEffect(() => {
    fetchGitCredentials();
    const intervalID = runTaskAtInterval(fetchGitCredentials, 10000);
    return () => clearInterval(intervalID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box p="10">
        <AddGitCredentialsModal
          addGitCredential={addGitCredential}
          isOpen={addModalDisclosure.isOpen}
          onClose={addModalDisclosure.onClose}
        />

        <Card mb="10" p="0">
          <CardBody>
            <Flex justifyContent="space-between">
              <Heading as="h2" size="md">
                Git Credentials
              </Heading>
              <Box>
                <Button size="sm" isLoading={isRefreshing} onClick={fetchGitCredentials}>
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

        {credentials.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            py="40"
          >
            <Text fontSize="18px" mt={3} mb={2}>
              No Git Credentials Found
            </Text>
            <Text color={"gray.500"} mb={6}>
              Add a git credential to get started
            </Text>

            <Button
              colorScheme="brand"
              w="fit-content"
              variant="solid"
              onClick={addModalDisclosure.onOpen}
            >
              Add Git Credential
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table variant="simple" colorScheme="brand">
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Record Name</Th>
                  <Th>Username</Th>
                  <Th>Password</Th>
                  <Th>Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {credentials.map((credential, index) => {
                  return (
                    <Tr key={index}>
                      <Td>{credential.id}</Td>
                      <Td>{credential.name}</Td>
                      <Td>{credential.username}</Td>
                      <Td onClick={()=>toggleShowPassword(credential.id)} cursor="pointer">
                        <Icon as={showPasswordId == credential.id ? EyeIcon : EyeClosedIcon} mr="2" />
                        {showPasswordId == credential.id ? credential.password : "********"}
                      </Td>
                      <Td>
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() => deleteGitCredential(credential.id)}
                          isDisabled={credential.name === "default"}
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
                  <Th>Record Name</Th>
                  <Th>Username</Th>
                  <Th>Password</Th>
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
