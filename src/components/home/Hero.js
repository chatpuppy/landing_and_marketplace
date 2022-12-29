import React from "react";
import {
  chakra, Box, useColorModeValue, Button, Stack, Image,
  Text, Icon, Link
} from "@chakra-ui/react";
import Design1 from "assets/design1.png"
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Blur } from '../common/Blur';

const Hero = () => {
  return (
    <Box px={8} pt={24} mx="auto">
      <Blur
        position={"absolute"}
        top={-10}
        left={-10}
        style={{ filter: "blur(70px)" }}
      />
      <Box
        w={{ base: "full", md: 11 / 12, xl: 9 / 12 }} mx="auto"
        textAlign={{ base: "left", md: "center" }}
      >
        <chakra.h1
          mb={6} fontSize={{ base: "4xl", md: "6xl" }} fontWeight="bold" lineHeight="none"
          letterSpacing={{ base: "normal", md: "tight" }} color={useColorModeValue("gray.900",'gray.100')}
        >
          Super secured{" "}
          <Text
            display={{ base: "block", lg: "inline" }} w="full" bgClip="text" 
            bgGradient="linear(to-r, green.400,purple.500)" fontWeight="extrabold"
          >
             NFT-based 
          </Text>{" "}
          wallet-to-wallet instant messenger
        </chakra.h1>
        <chakra.p
          px={{ base: 0, lg: 24 }} mb={6} fontSize={{ base: "lg", md: "xl" }}
          color={useColorModeValue("gray.600",'gray.300')}
        >
          
        </chakra.p>
        <Stack
          direction={{base:"column",sm:"row"}} mb={{ base: 4, md: 8 }} spacing={2}
          justifyContent={{ sm: "left", md: "center" }}
        >
          <Button
            colorScheme="gray" display="inline-flex" alignItems="center" justifyContent="center"
            w={{ base: "full", sm: "auto" }} mb={{ base: 2, sm: 0 }} size="lg" cursor="pointer"
            bg="brand.100" color="white"
            _hover={{
              backgroundColor: "brand.200"
            }}
          >
            <Link href='https://puppy.chat' isExternal
              style={{textDecoration: 'none'}}>
              Demo
              <Icon boxSize={4} ml={1} viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </Icon>
            </Link>
          </Button>
          <Button
            as="a" href="https://discord.gg/QN658sJWkk" target="_blank" variant="solid" display="inline-flex" alignItems="center" justifyContent="center"
            w={{ base: "full", sm: "auto" }} mb={{ base: 2, sm: 0 }} size="lg" cursor="pointer" rightIcon={<ExternalLinkIcon />}
          >
            Discord
          </Button>
        </Stack>
      </Box>
      <Box
        w={{ base: "full", md: 10 / 12 }} mx="auto" textAlign="center"
      >
        <Image
          w="100vw" src={Design1} alt="Screenshot"
        />
      </Box>
    </Box>
  );
};

export default Hero;