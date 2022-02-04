import React from "react";

import {
  chakra,
  Box,
  Flex,
  useColorModeValue,
  Icon,
  SimpleGrid,
  Button,
  VStack,
} from "@chakra-ui/react";
export default function FeaturesList() {
  const Feature = (props) => {
    return (
      <Flex>
        <Icon
          boxSize={5}
          mt={1}
          mr={2}
          color={useColorModeValue("brand.500", "brand.300")}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          ></path>
        </Icon>
        <chakra.p
          fontSize="lg"
          color={useColorModeValue("gray.700", "gray.400")}
          {...props}
        />
      </Flex>
    );
  };

  return (
    <Flex
      bg={useColorModeValue("#F9FAFB", "gray.700")}
      p={20}
      w="auto"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        shadow="xl"
        rounded="xl"
        bg={useColorModeValue("white", "gray.800")}
        px={8}
        py={20}
        mx="auto"
      >
        <SimpleGrid
          alignItems="center"
          columns={{ base: 1, lg: 2 }}
          spacingY={{ base: 10, lg: 32 }}
          spacingX={{ base: 10, lg: 24 }}
        >
          <Box ml="6">
            <chakra.h2
              mb={3}
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="extrabold"
              textAlign={{ base: "center", sm: "left" }}
              color={useColorModeValue("black")}
              lineHeight="shorter"
              letterSpacing="tight"
            >
              Send Secure Messages
            </chakra.h2>
            <chakra.p
              mb={6}
              fontSize={{ base: "lg", md: "xl" }}
              textAlign={{ base: "center", sm: "left" }}
              color={useColorModeValue("gray.600", "gray.500")}
            >
              Use fully encrypted, p2p, wallet to wallet messaging service
            </chakra.p>
            <Button
              as="a"
              variant="solid"
              w={{ base: "full", sm: "auto" }}
              size="lg"
            >
              Start Now!
            </Button>
          </Box>
          <VStack
            direction="column"
            flexGrow={1}
            spacing={5}
            alignItems="start"
          >
            <Feature>Supporting by xxnetwork</Feature>
            <Feature>Messaging is fully decentralized encrypted and sent through random gateways all over the world</Feature>
            <Feature>Sending or recieving messages over multi-chains available</Feature>
            <Feature>No messages saved on blockchains. Fully peer-to-peer instant messaging</Feature>
            <Feature>Quantum secured encrypted algorithm protects messages</Feature>
            <Feature>No servers, AI, companies or goverments can ineract with the messages</Feature>
          </VStack>
        </SimpleGrid>
      </Box>
    </Flex>
  );
}