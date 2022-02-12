import React, { useState, useEffect } from "react";
import ToggleTheme from "utils/ToggleTheme";
import Logo from 'assets/logo.png'
import { Link as RouterLink } from "react-router-dom";
import {
  chakra, Box, Flex, useColorModeValue, VisuallyHidden, HStack, Button,
  useDisclosure, VStack, IconButton, CloseButton, Image, Alert,
  AlertIcon, AlertTitle, AlertDescription,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useAuth } from "contexts/AuthContext";

export default function NavBar() {
  const bg = useColorModeValue("white", "gray.800");
  const mobileNav = useDisclosure();

  const { currentNetwork } = useAuth();

  const [ shadow, setShadow ] = useState("");

  const handleScroll = () => {
      if(window.pageYOffset>50) {
        setShadow("md")
      } else setShadow("")
  };

  useEffect(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
          window.removeEventListener('scroll', handleScroll);
      };
  }, []);

  return (
    
    <React.Fragment >
      {
        currentNetwork!==42 ?
        <Alert status='error'>
          <AlertIcon />
          <AlertTitle mr={2}>Different network detected!</AlertTitle>
          <AlertDescription>Please change network to Kovan.</AlertDescription>
        </Alert>
        : <></>
      }
      <chakra.header 
        style={{position: "sticky",
        top: 0}}
        bg={shadow==="md"? bg : ""}
        w="full"
        px={{ base: 2, sm: 4 }}
        py={4}
        shadow={shadow}
        zIndex={2}
      >
        <Flex alignItems="center" justifyContent="space-between" mx="auto">
          <Flex>
            <chakra.a
              href="/"
              title="Chat Puppy Home Page"
              display="flex"
              alignItems="center"
            >
              <VisuallyHidden>ChatPuppy</VisuallyHidden>
            </chakra.a>
            <RouterLink to="/" style={{textDecoration: 'none'}}>
                <HStack>
                <Image src={Logo} h="60px"/>
                <chakra.h1 fontSize="xl" fontWeight="medium" ml="2">
                  ChatPuppy
                </chakra.h1>
                </HStack>
            </RouterLink>
          </Flex>
          <HStack display="flex" alignItems="center" spacing={1}>
            <HStack
              spacing={1}
              mr={1}
              color="brand.500"
              display={{ base: "none", md: "inline-flex" }}
            >
              <RouterLink to="/" style={{textDecoration: 'none'}}>
                <Button variant="ghost">Home</Button>         
              </RouterLink>
              <RouterLink to="/mint" style={{textDecoration: 'none'}}>
                <Button variant="ghost">Mint</Button>
              </RouterLink>
              <RouterLink to="/marketplace" style={{textDecoration: 'none'}}>
                <Button variant="ghost">Marketplace</Button>
              </RouterLink>
              <RouterLink to="/account" style={{textDecoration: 'none'}}>
                <Button variant="ghost">Account</Button>
              </RouterLink>
              <ToggleTheme />
            </HStack>
            <Button size="md" bg="brand.100" color="white">
              Go To App
            </Button>
            <Box display={{ base: "inline-flex", md: "none" }}>
              <IconButton
                display={{ base: "flex", md: "none" }}
                aria-label="Open menu"
                fontSize="20px"
                color={useColorModeValue("gray.800", "inherit")}
                variant="ghost"
                icon={<HamburgerIcon />}
                onClick={mobileNav.onOpen}
              />

              <VStack
                pos="absolute"
                top={0}
                left={0}
                right={0}
                display={mobileNav.isOpen ? "flex" : "none"}
                flexDirection="column"
                p={2}
                pb={4}
                m={2}
                bg={bg}
                spacing={3}
                rounded="sm"
                shadow="md"
              >
                <CloseButton
                  aria-label="Close menu"
                  onClick={mobileNav.onClose}
                />
                <RouterLink to="/" style={{textDecoration: 'none'}}>
                  <Button w="full" variant="ghost">
                    Home
                  </Button>                </RouterLink>
                <RouterLink to="/mint" style={{textDecoration: 'none'}}>
                  <Button w="full" variant="ghost">
                    Mint
                  </Button>                </RouterLink>
                <RouterLink to="/marketplace" style={{textDecoration: 'none'}}>
                  <Button w="full" variant="ghost">
                    Marketplace
                  </Button>
                </RouterLink>
                <RouterLink to="/account" style={{textDecoration: 'none'}}>
                  <Button w="full" variant="ghost">
                    Account
                  </Button>
                </RouterLink>
                <ToggleTheme />
              </VStack>
            </Box>
          </HStack>
        </Flex>
      </chakra.header>
    </React.Fragment>
  );
}