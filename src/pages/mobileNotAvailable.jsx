import { Box, Image, Text } from "@chakra-ui/react";

import Logo from "../assets/images/logo-full-inverse.png";

export default function MobileVersionNotAvailale() {
    return (
        <Box
            w="100vw"
            minH="100vh"
            bg="brand.400"
            px="8"
            py="16"
            display="flex"
            alignItems="center"
            flexDirection="column"
        >
            {/* Logo */}
            <Image src={Logo} alt="Logo" w="80%" h="auto" />
            {/* Disclaimer  */}
            <Box
                bg="brand.300"
                padding="4"
                borderRadius="md"
                mt="16"
            >
                <Text fontSize="xl" fontWeight="bold" color="white">
                    Mobile Version Not Available
                </Text>
                <Text fontSize="md" color="white" mt="4">
                    Please use a desktop browser to access.
                </Text>
            </Box>
        </Box>

    );
}