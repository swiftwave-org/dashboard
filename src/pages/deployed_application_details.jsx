import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Icon,
  Tag,
  useToast,
} from "@chakra-ui/react";
import { SyncIcon } from "@primer/octicons-react";
import { useContext, useEffect, useState } from "react";
import ControllerContext from "../context/controller/ControllerContext";
import { showErrorToast } from "../utils";
import tag_color from "../config/tag_color";
import { useParams } from "react-router-dom";

export default function DeployedApplicationDetailsPage() {
  const controller = useContext(ControllerContext);
  const toast = useToast();
  const [loadingState, setLoadingState] = useState(-1);
  // -1: loading, 0: error, 1: success
  const [applicationDetails, setApplicationDetails] = useState({});

  const { id } = useParams();

  const fetchApplicationDetails = async (id) => {
    setLoadingState(-1);
    const res = await controller.applications.fetchDetails(id);
    if (res.status) {
      setApplicationDetails(res.data);
      setLoadingState(1);
    } else {
      showErrorToast(toast, res.message);
      setLoadingState(0);
    }
  };

  useEffect(() => {
    fetchApplicationDetails(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      {loadingState === -1 ? (
        <div>Loading...</div>
      ) : loadingState === 0 ? (
        <div>Error</div>
      ) : (
        <Box p="10">
          <Card mb="10" p="0">
            <CardBody>
              <Flex justifyContent="space-between">
                <Flex>
                  <Heading as="h2" size="md" mr="4">
                    {applicationDetails.service_name}
                  </Heading>
                  <Tag
                    size="md"
                    key="md"
                    variant="solid"
                    colorScheme={tag_color[applicationDetails.status]}
                    fontWeight="bold"
                    borderRadius="md"
                    style={{
                      textTransform: "uppercase",
                    }}
                  >
                    {applicationDetails.status}
                  </Tag>
                </Flex>
                <Box>
                  <Button size="sm">
                    <Icon as={SyncIcon} mr="2" />
                    Refresh
                  </Button>
                </Box>
              </Flex>
            </CardBody>
          </Card>
          {/* TODO: add form */}
        </Box>
      )}
    </>
  );
}
