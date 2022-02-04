import React from "react";
import Sample1 from "assets/sample_1.png";
import Sample2 from "assets/sample_2.png";

import {
  Box, Button, chakra, SimpleGrid, useColorModeValue,
  Image
} from "@chakra-ui/react";

export default function FeaturesLeftRight() {
  return (
      <Box
        bg={useColorModeValue("white", "gray.800")}
        px={8}
        py={20}
        mx="auto"
      >
        <SimpleGrid
          alignItems="start"
          columns={{ base: 1, md: 2 }}
          mb={24}
          spacingY={{ base: 10, md: 32 }}
          spacingX={{ base: 10, md: 24 }}
        >
          <Box mt={{ lg: "100"}}>
            <chakra.h2
              mb={4}
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="bold"
              letterSpacing="tight"
              textAlign={{ base: "center", md: "left" }}
              color={useColorModeValue("brand.100", "gray.400")}
              lineHeight={{ md: "shorter" }}
            >
              Clear overview for efficient tracking
            </chakra.h2>
            <chakra.p
              mb={5}
              textAlign={{ base: "center", sm: "left" }}
              color={useColorModeValue("gray.600", "gray.400")}
              fontSize={{ md: "lg" }}
            >
              Handle your subscriptions and transactions efficiently with the
              clear overview in Dashboard. Features like the smart search option
              allow you to quickly find any data you’re looking for.
            </chakra.p>
            <Button
              w={{ base: "full", sm: "auto" }}
              size="lg"
              _hover={{ bg: useColorModeValue("gray.700", "gray.600") }}
              as="a"
              bg="brand.100" color="white"
            >
              Learn More
            </Button>
          </Box>
          <Image shadow="xl" rounded="xl"
          src={Sample1} h={{base: "50vh", lg: "50vh"}} w={{base: "80vw", lg: "50vw"}}/>
        </SimpleGrid>
        <SimpleGrid
          alignItems="center"
          columns={{ base: 1, md: 2 }}
          flexDirection="column-reverse"
          mb={24}
          spacingY={{ base: 10, md: 32 }}
          spacingX={{ base: 10, md: 24 }}
        >
          <Box order={{ base: "none", md: 2 }}>
            <chakra.h2
              mb={4}
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="extrabold"
              letterSpacing="tight"
              textAlign={{ base: "center", md: "left" }}
              color={useColorModeValue("brand.100", "gray.400")}
              lineHeight={{ md: "shorter" }}
            >
              Decide how you integrate Payments
            </chakra.h2>
            <chakra.p
              mb={5}
              textAlign={{ base: "center", sm: "left" }}
              color={useColorModeValue("gray.600", "gray.400")}
              fontSize={{ md: "lg" }}
            >
              Love to code? Next to our ready-made and free plugins you can use
              our expansive yet simple API; decide how you integrate Payments
              and build advanced and reliable products yourself from scratch.
            </chakra.p>
            <Button
              w={{ base: "full", sm: "auto" }}
              size="lg"
              _hover={{ bg: useColorModeValue("gray.700", "gray.600") }}
              as="a"
              bg="brand.100" color="white"
            >
              Learn More
            </Button>
          </Box>
          <Image shadow="xl" rounded="xl"
          src={Sample2} h={{base: "50vh", lg: "50vh"}} w={{base: "80vw", lg: "50vw"}}/>
        </SimpleGrid>
      </Box>
  );
}