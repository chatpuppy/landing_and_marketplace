import React from "react";
import { chakra, Box, Image, Flex, useColorModeValue } from "@chakra-ui/react";

const NFTCard = (props) => {

    const { src, number } = props;

    return (
    <Flex
      bg={useColorModeValue("#F9FAFB", "gray.600")}
      p={50}
      w="full"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        maxW="xs"
        mx="auto"
        bg={useColorModeValue("white", "gray.800")}
        shadow="lg"
        rounded="lg"
      >
        <Box px={4} py={2}>
          <chakra.h1
            color={useColorModeValue("gray.800", "white")}
            fontWeight="bold"
            fontSize="3xl"
            textTransform="uppercase"
          >
            NFT
          </chakra.h1>
          <chakra.p
            mt={1}
            fontSize="sm"
            color={useColorModeValue("gray.600", "gray.400")}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi quos
            quidem sequi illum facere recusandae voluptatibus
          </chakra.p>
        </Box>

        <Image
          h={48}
          w="full"
          fit="cover"
          mt={2}
          src={src}
          alt="TITLE"
        />

        <Flex
          alignItems="center"
          justifyContent="space-between"
          px={4}
          py={2}
          bg="gray.900"
          roundedBottom="lg"
        >
          <chakra.h1 color="white" fontWeight="bold" fontSize="lg">
            {number}
          </chakra.h1>
          <chakra.button
            px={2}
            py={1}
            bg="white"
            fontSize="xs"
            color="gray.900"
            fontWeight="bold"
            rounded="lg"
            textTransform="uppercase"
            _hover={{
              bg: "gray.200",
            }}
            _focus={{
              bg: "gray.400",
            }}
          >
            Add to cart
          </chakra.button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default NFTCard;