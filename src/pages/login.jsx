import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Image,
} from "@chakra-ui/react";
import Logo from "../assets/images/logo-full.png";

export default function LoginPage() {
  return (
    <Flex minH="100vh" align="center" justify="center" bg="brand.50">
      <Stack spacing="8" mx="auto" w="md" py="12" px="6">
        <Stack align="center">
          <Image src={Logo} alt="Logo" w="60%" h="auto" />
        </Stack>
        <Box rounded="lg" bg="white" boxShadow="lg" p="8" mt="5">
          <Stack spacing="4">
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" isRequired={true} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" isRequired={true} />
            </FormControl>
            <Button colorScheme="brand" mt="4">
              Sign in
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
