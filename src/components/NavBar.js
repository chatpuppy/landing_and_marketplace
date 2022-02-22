import React, { useState, useEffect } from "react";
import ToggleTheme from "utils/ToggleTheme";
import Logo from 'assets/logo.png'
import { Link as RouterLink } from "react-router-dom";
import {
  chakra, Box, Flex, useColorModeValue, VisuallyHidden, HStack, Button,
  useDisclosure, VStack, IconButton, CloseButton, Image, Alert,
  AlertIcon, AlertTitle, AlertDescription, Link, Icon
} from "@chakra-ui/react";
import { HamburgerIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { useAuth } from "contexts/AuthContext";
import LoginButton from "components/LoginButton";

export default function NavBar() {
  const bg = useColorModeValue("white", "gray.800");
  const mobileNav = useDisclosure();

  const [ path, setPath ] = useState("");

  const { currentNetwork } = useAuth();

  const [ shadow, setShadow ] = useState("");

  const handleScroll = () => {
      if(window.pageYOffset>50) {
        setShadow("md")
      } else setShadow("")
  };

  useEffect(() => {
    
    setPath(window.location.pathname)
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
  }, [setPath]);

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
                <Button variant={path==="/mint" ? "solid" : "ghost"}>Mint</Button>
              </RouterLink>
              <RouterLink to="/marketplace" style={{textDecoration: 'none'}}>
                <Button variant={path==="/marketplace" ? "solid" : "ghost"}>Marketplace</Button>
              </RouterLink>
              <RouterLink to="/account" style={{textDecoration: 'none'}}>
                <Button variant={path==="/account" ? "solid" : "ghost"}>My NFTs</Button>
              </RouterLink>
              <Button as="a" href="https://snapshot.org/#/chatpuppy.eth" target="_blank" variant="ghost"
                rightIcon={<ExternalLinkIcon />}
              >Governance</Button>
              <ToggleTheme />
              <LoginButton />
            </HStack>
            <Button size="md" bg="brand.100" color="white"
            _hover={{
              backgroundColor: "brand.200"
            }}
            >
              <Link href='http://test.chatpuppy.com:9200' isExternal
              style={{textDecoration: 'none'}}>
                Go To App 
                <Icon boxSize={4} ml={1} viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </Icon>
              </Link>
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
                  <Button w="full" variant={path==="/mint" ? "solid" : "ghost"}>
                    Mint
                  </Button>                </RouterLink>
                <RouterLink to="/marketplace" style={{textDecoration: 'none'}}>
                  <Button w="full" variant={path==="/marketplace" ? "solid" : "ghost"}>
                    Marketplace
                  </Button>
                </RouterLink>
                <RouterLink to="/account" style={{textDecoration: 'none'}}>
                  <Button w="full" variant={path==="/account" ? "solid" : "ghost"}>
                    My NFTs
                  </Button>
                </RouterLink>
                <LoginButton />
                <ToggleTheme />
              </VStack>
            </Box>
          </HStack>
        </Flex>
      </chakra.header>
    </React.Fragment>
  );
}