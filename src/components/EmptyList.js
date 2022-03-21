import React from "react";
import { chakra, Box, Image, Flex, useColorModeValue, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import BoxImageSrc from "assets/mysteryBox.jpg"

const EmptyList = () => {

    const navigate = useNavigate()

    const buttonbg = useColorModeValue("white", "gray.900")

    return (
        <Flex
        bg={useColorModeValue("white", "gray.800")}
        p={5}
        ml={10}
        mr={10}
        w="full"
        alignItems="center"
        justifyContent="center"
    >
      <Box
      maxW="xs"
      mx="auto"
      h="lg"
      bg={useColorModeValue("white","gray.200")}
      shadow="lg"
      rounded="lg"
    >
      <Image
        w="full"
        roundedTop="lg"
        fit="cover"
        src={BoxImageSrc}
        alt="NIKE AIR"
      />
      <Box px={4} py={2}>
        <chakra.h1
          color={useColorModeValue("gray.800", "gray.800")}
          fontWeight="bold"
          fontSize="xl"
          textTransform="uppercase"
        >
          No NFTs Found
        </chakra.h1>
        <chakra.span
          color={useColorModeValue("gray.800", "gray.800")}
          fontSize="md"
        >
          Go To Mint Page
        </chakra.span>
      </Box>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        px={4}
        py={2}
        roundedBottom="lg"
      >
          <Button mb={3} bg={buttonbg} 
          // _hover={{
          //     bg: "gray.500",
          // }}
          // _focus={{
          //     bg: "gray.600",
          // }} 
          onClick={()=>{navigate("/mint")}}>Mint</Button>
        </Flex>
      </Box>
      
    </Flex>
  );
};

export default EmptyList;