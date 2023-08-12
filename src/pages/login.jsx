import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Image,
  useToast,
} from "@chakra-ui/react";
import Logo from "../assets/images/logo-full.png";
import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../context/auth/authContext";

export default function LoginPage() {
  const toast = useToast();
  const authContext = useContext(AuthContext);
  const [isLoginButtonLoading, setIsLoginButtonLoading] = useState(false);
  const formDetails = useRef({
    username: "",
    password: "",
  })

  const handleSubmission = async()=>{
    if(formDetails.username === "" || formDetails.password === "") {
      toast({
        title: "Error",
        description: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setIsLoginButtonLoading(true);
    const response = await authContext.authenticate(formDetails.username, formDetails.password);
    if(response.status === true) {
      toast({
        title: "Success",
        description: response.message,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } else {
      toast({
        title: "Error",
        description: response.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
    setIsLoginButtonLoading(false);
  }

  useEffect(()=>{
    authContext.recoverToken();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex minH="100vh" align="center" justify="center" bg="brand.50">
      <Stack spacing="8" mx="auto" w="md" py="12" px="6">
        <Stack align="center">
          <Image src={Logo} alt="Logo" w="60%" h="auto" />
        </Stack>
        <Box rounded="lg" bg="white" boxShadow="lg" p="8" mt="5">
          <Stack spacing="4">
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input type="text" isRequired={true} onChange={e=>formDetails.username=e.target.value} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" isRequired={true} onChange={e=>formDetails.password=e.target.value} />
            </FormControl>
            <Button colorScheme="brand" mt="4" onClick={handleSubmission} isLoading={isLoginButtonLoading} isDisabled={isLoginButtonLoading}>
              Sign in
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
