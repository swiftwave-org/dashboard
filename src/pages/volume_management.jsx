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
import { SyncIcon } from "@primer/octicons-react";
import { useContext, useEffect, useState } from "react";
import ControllerContext from "../context/controller/ControllerContext";
import { showErrorToast, showSuccessToast, runTaskAtInterval } from "../utils";
import { AddIcon } from "@chakra-ui/icons";
import AddVolumeModal from "../components/addVolumeModal";

export default function VolumeManagementPage() {
  const controller = useContext(ControllerContext);
  const toast = useToast();
  const [volumes, setVolumes] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // add modal disclosure
  const addModalDisclosure = useDisclosure();

  const fetchVolumes = async () => {
    setIsRefreshing(true);
    const res = await controller.volumes.fetchAll();
    if (res.status) {
      setVolumes(res.data);
    } else {
      showErrorToast(toast, res.message);
    }
    setIsRefreshing(false);
  };

  const deleteVolume = async (name) => {
    const res = confirm("Are you sure you want to delete volume ?");
    if (res) {
      const res = await controller.volumes.delete(name);
      if (res.status) {
        showSuccessToast(toast, res.message);
        fetchVolumes();
      } else {
        showErrorToast(toast, res.message);
      }
    }
  };

  const addVolume = async ({ name }) => {
    const res = await controller.volumes.add(name);
    if (res.status) {
      showSuccessToast(toast, res.message);
      fetchVolumes();
      addModalDisclosure.onClose();
    } else {
      showErrorToast(toast, res.message);
    }
  };

  useEffect(() => {
    fetchVolumes();
    const intervalID = runTaskAtInterval(fetchVolumes, 10000);
    return () => clearInterval(intervalID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box p="10">
        <AddVolumeModal
          addVolume={addVolume}
          isOpen={addModalDisclosure.isOpen}
          onClose={addModalDisclosure.onClose}
        />

        <Card mb="10" p="0">
          <CardBody>
            <Flex justifyContent="space-between">
              <Heading as="h2" size="md">
                Persistent Volume Management
              </Heading>
              <Box>
                <Button
                  size="sm"
                  isLoading={isRefreshing}
                  onClick={fetchVolumes}
                >
                  <Icon as={SyncIcon} mr="2" />
                  Refresh volumes
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

        {volumes.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            py="40"
          >
            <Text fontSize="18px" mt={3} mb={2}>
              No Volumes Found
            </Text>
            <Text color={"gray.500"} mb={6}>
              Add Persistent Volume to mount it to your applications
            </Text>

            <Button
              colorScheme="brand"
              w="fit-content"
              variant="solid"
              onClick={addModalDisclosure.onOpen}
            >
              Add Volume
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table variant="simple" colorScheme="brand">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {volumes.map((volume, index) => {
                  return (
                    <Tr key={index}>
                      <Td>{volume}</Td>
                      <Td>
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() => deleteVolume(volume)}
                        >
                          Delete Volume
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>Name</Th>
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
