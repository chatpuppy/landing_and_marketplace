import React from "react";
import { chakra, Box, Image, Flex, useColorModeValue, Button } from "@chakra-ui/react";
import { useAuth } from "contexts/AuthContext";

const ListedCard = (props) => {

    const { id, owner } = props;
    const { currentAccount } = useAuth();
    const bg = useColorModeValue("gray.700", "gray.200")
    const buttonbg = useColorModeValue("white", "gray.900")

    return (
    <Flex
        bg={useColorModeValue("white", "gray.800")}
        p={50}
        w="full"
        alignItems="center"
        justifyContent="center"
    >
        <Box
        maxW="xs"
        mx="auto"
        bg={useColorModeValue("gray.700","white")}
        shadow="lg"
        rounded="lg"
      >
        <Box px={4} py={2}>
          <chakra.h1
            color={useColorModeValue("white","gray.800")}
            fontWeight="bold"
            fontSize="3xl"
            textTransform="uppercase"
          >
            ID #{id}
          </chakra.h1>
          <chakra.p
            mt={1}
            fontSize="sm"
            color={useColorModeValue( "gray.400","gray.600")}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi quos
            quidem sequi illum facere recusandae voluptatibus
          </chakra.p>
        </Box>

        <Image
          w="full"
          fit="cover"
          h="40vh"
          mt={2}
          src={"https://www.larvalabs.com/cryptopunks/cryptopunk"+id+".png"}
          alt="NIKE AIR"
        />

        <Flex
          alignItems="center"
          justifyContent="space-between"
          px={4}
          py={2}
          bg={bg}
          roundedBottom="lg"
        >
          <Button size="md" bg={buttonbg} color={bg}
            fontWeight="bold" rounded="lg" textTransform="uppercase"
            _hover={{
                bg: "gray.500",
            }}
            _focus={{
                bg: "gray.600",
            }}
            >
            Unbox
            </Button>
          <Button size="md" bg={buttonbg} color={bg}
            fontWeight="bold" rounded="lg" textTransform="uppercase"
            _hover={{
                bg: "gray.500",
            }}
            _focus={{
                bg: "gray.600",
            }}
            >
            Unbox
            </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default ListedCard;