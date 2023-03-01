/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import ToggleTheme from 'utils/ToggleTheme';
import Logo from 'assets/logo.png';
import { Link as RouterLink } from 'react-router-dom';
import {
  chakra,
  Box,
  Flex,
  useColorModeValue,
  VisuallyHidden,
  HStack,
  Button,
  useDisclosure,
  VStack,
  IconButton,
  CloseButton,
  Image,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Link,
  Icon,
} from '@chakra-ui/react';
import { HamburgerIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { useAuth } from 'contexts/AuthContext';
import LoginButton from 'components/LoginButton';
import {
  supportedChainNames,
  supportedChainIds,
  getNetworkConfig,
} from '../constants';

export default function NavBar(props) {
  const bg = useColorModeValue('white', 'gray.800');
  const mobileNav = useDisclosure();

  const [path, setPath] = useState('');
  const { currentNetwork } = useAuth();
  const [shadow, setShadow] = useState('');
  const networkConfig = getNetworkConfig(currentNetwork);

  const handleScroll = () => {
    if (window.pageYOffset > 50) {
      setShadow('md');
    } else setShadow('');
  };

  const color = useColorModeValue('gray.800', 'inherit');

  useEffect(() => {
    setPath(window.location.pathname);
    // setPath(props.action);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [props.action, setPath]);

  return (
    <React.Fragment>
      {path !== '/' ? (
        <Alert status="warning" justifyContent="center">
          {/* <AlertIcon /> */}
          <AlertTitle mr={2}>
            Available on {supportedChainNames().join(', ')} now!
          </AlertTitle>
          <AlertDescription>
            Please{' '}
            <Link
              isExternal
              style={{ textDecoration: 'underline' }}
              href="https://discord.gg/QN658sJWkk">
              join our discord <ExternalLinkIcon />
            </Link>{' '}
            for more information.
          </AlertDescription>
          {/* <CloseButton position='absolute' right='8px' top='8px'/> */}
        </Alert>
      ) : (
        <></>
      )}
      {!supportedChainIds.includes(currentNetwork) && path !== '/' ? (
        <Alert status="error" justifyContent="center">
          <AlertIcon />
          <AlertTitle mr={2}>Wrong network detected!</AlertTitle>
          <AlertDescription>
            Please change network to {supportedChainNames().join(', ')}.
          </AlertDescription>
          {/* <CloseButton position='absolute' right='8px' top='8px'/> */}
        </Alert>
      ) : (
        <></>
      )}
      <chakra.header
        style={{ position: 'sticky', top: 0 }}
        bg={shadow === 'md' ? bg : ''}
        w="full"
        px={{ base: 2, sm: 4 }}
        py={4}
        shadow={shadow}
        zIndex={2}>
        <Flex alignItems="center" justifyContent="space-between" mx="auto">
          <Flex>
            <chakra.a
              href="/"
              title="Chat Puppy Home Page"
              display="flex"
              alignItems="center">
              <VisuallyHidden>ChatPuppy</VisuallyHidden>
            </chakra.a>
            <RouterLink to="/" style={{ textDecoration: 'none' }}>
              <HStack>
                <Image src={Logo} h="60px" />
                <chakra.h1 fontSize="xl" fontWeight="medium" ml="2">
                  ChatPuppy
                </chakra.h1>
              </HStack>
            </RouterLink>
          </Flex>
          {props.showMenu ? (
            <HStack display="flex" alignItems="center" spacing={1}>
              <HStack
                spacing={1}
                mr={1}
                color="brand.500"
                display={{ base: 'none', md: 'inline-flex' }}>
                {path === '/' ? (
                  <></>
                ) : (
                  <Box>
                    <RouterLink to="/" style={{ textDecoration: 'none' }}>
                      <Button variant="ghost" mr="3">
                        Home
                      </Button>
                    </RouterLink>

                    {networkConfig === undefined ||
                    !networkConfig.buttons.donateMenu.visible ? (
                      <></>
                    ) : (
                      <RouterLink
                        to={networkConfig.buttons.donateMenu.url}
                        style={{ textDecoration: 'none' }}>
                        <Button
                          variant={
                            path === networkConfig.buttons.donateMenu.url
                              ? 'solid'
                              : 'ghost'
                          }
                          mr="3">
                          {networkConfig.buttons.donateMenu.label}
                        </Button>
                      </RouterLink>
                    )}

                    {networkConfig === undefined ||
                    !networkConfig.buttons.mintMenu.visible ? (
                      <></>
                    ) : networkConfig.buttons.mintMenu.url.substr(0, 1) ===
                      '/' ? (
                      <RouterLink
                        to={networkConfig.buttons.mintMenu.url}
                        style={{ textDecoration: 'none' }}>
                        <Button
                          variant={
                            path === networkConfig.buttons.mintMenu.url
                              ? 'solid'
                              : 'ghost'
                          }
                          mr="3">
                          {networkConfig.buttons.mintMenu.label}
                        </Button>
                      </RouterLink>
                    ) : (
                      <Button
                        as="a"
                        href={networkConfig.buttons.mintMenu.url}
                        target="_blank"
                        variant="ghost">
                        {networkConfig.buttons.mintMenu.label}
                      </Button>
                    )}

                    {networkConfig === undefined ||
                    !networkConfig.buttons.accountMenu.visible ? (
                      <></>
                    ) : (
                      <RouterLink
                        to={networkConfig.buttons.accountMenu.url}
                        style={{ textDecoration: 'none' }}>
                        <Button
                          variant={
                            path === networkConfig.buttons.accountMenu.url
                              ? 'solid'
                              : 'ghost'
                          }
                          mr="3">
                          {networkConfig.buttons.accountMenu.label}
                        </Button>
                      </RouterLink>
                    )}

                    {networkConfig === undefined ||
                    !networkConfig.buttons.marketplaceMenu.visible ? (
                      <></>
                    ) : networkConfig.buttons.marketplaceMenu.url.substr(
                        0,
                        1
                      ) === '/' ? (
                      <RouterLink
                        to={networkConfig.buttons.marketplaceMenu.url}
                        style={{ textDecoration: 'none' }}>
                        <Button
                          variant={
                            path === networkConfig.buttons.marketplaceMenu.url
                              ? 'solid'
                              : 'ghost'
                          }
                          mr="3">
                          {networkConfig.buttons.marketplaceMenu.label}
                        </Button>
                      </RouterLink>
                    ) : (
                      <Button
                        as="a"
                        href={networkConfig.buttons.marketplaceMenu.url}
                        target="_blank"
                        variant="ghost"
                        rightIcon={<ExternalLinkIcon />}>
                        {networkConfig.buttons.marketplaceMenu.label}
                      </Button>
                    )}

                    {networkConfig === undefined ||
                    !networkConfig.buttons.governanceMenu.visible ? (
                      <></>
                    ) : networkConfig.buttons.governanceMenu.url.substr(
                        0,
                        1
                      ) === '/' ? (
                      <RouterLink
                        to={networkConfig.buttons.governanceMenu.url}
                        style={{ textDecoration: 'none' }}>
                        <Button
                          variant={
                            path === networkConfig.buttons.governanceMenu.url
                              ? 'solid'
                              : 'ghost'
                          }
                          mr="3">
                          {networkConfig.buttons.governanceMenu.label}
                        </Button>
                      </RouterLink>
                    ) : (
                      <Button
                        as="a"
                        href={networkConfig.buttons.governanceMenu.url}
                        target="_blank"
                        variant="ghost"
                        rightIcon={<ExternalLinkIcon />}>
                        {networkConfig.buttons.governanceMenu.label}
                      </Button>
                    )}

                    {networkConfig === undefined ||
                    !networkConfig.buttons.bridgeMenu.visible ? (
                      <></>
                    ) : (
                      <Button
                        as="a"
                        href={networkConfig.buttons.bridgeMenu.url}
                        target="_blank"
                        variant="ghost"
                        rightIcon={<ExternalLinkIcon />}>
                        {networkConfig.buttons.bridgeMenu.label}
                      </Button>
                    )}
                  </Box>
                )}
                <ToggleTheme />
                {path === '/' ? <></> : <LoginButton />}
              </HStack>
              <Button
                size="md"
                bg="brand.100"
                color="white"
                // _hover={{
                //   backgroundColor: "brand.200"
                // }}
              >
                <Link
                  href="https://puppy.chat"
                  isExternal
                  style={{ textDecoration: 'none' }}>
                  Demo
                  <Icon
                    boxSize={4}
                    ml={1}
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </Icon>
                </Link>
              </Button>

              <Box display={{ base: 'inline-flex', md: 'none' }}>
                <IconButton
                  display={{ base: 'flex', md: 'none' }}
                  aria-label="Open menu"
                  fontSize="20px"
                  color={color}
                  variant="ghost"
                  icon={<HamburgerIcon />}
                  onClick={mobileNav.onOpen}
                />
                <VStack
                  pos="absolute"
                  top={0}
                  left={0}
                  right={0}
                  display={mobileNav.isOpen ? 'flex' : 'none'}
                  flexDirection="column"
                  p={2}
                  pb={4}
                  m={2}
                  bg={bg}
                  spacing={3}
                  rounded="sm"
                  shadow="md">
                  <CloseButton
                    aria-label="Close menu"
                    onClick={mobileNav.onClose}
                  />

                  {path === '/' ? (
                    <></>
                  ) : (
                    <Box>
                      <RouterLink to="/" style={{ textDecoration: 'none' }}>
                        <Button w="full" variant="ghost">
                          Home
                        </Button>
                      </RouterLink>
                      {networkConfig === undefined ||
                      !networkConfig.buttons.mintMenu.visible ? (
                        <></>
                      ) : networkConfig.buttons.mintMenu.url.substr(0, 1) ===
                        '/' ? (
                        <RouterLink
                          to={networkConfig.buttons.mintMenu.url}
                          style={{ textDecoration: 'none' }}>
                          <Button
                            w="full"
                            variant={
                              path === networkConfig.buttons.mintMenu.url
                                ? 'solid'
                                : 'ghost'
                            }>
                            {networkConfig.buttons.mintMenu.label}
                          </Button>
                        </RouterLink>
                      ) : (
                        <Button
                          w="full"
                          as="a"
                          href={networkConfig.buttons.mintMenu.url}
                          target="_blank"
                          variant="ghost">
                          {networkConfig.buttons.mintMenu.label}
                        </Button>
                      )}

                      {networkConfig === undefined ||
                      !networkConfig.buttons.donateMenu.visible ? (
                        <></>
                      ) : (
                        <RouterLink
                          to={networkConfig.buttons.donateMenu.url}
                          style={{ textDecoration: 'none' }}>
                          <Button
                            w="full"
                            variant={
                              path === networkConfig.buttons.donateMenu.url
                                ? 'solid'
                                : 'ghost'
                            }>
                            {networkConfig.buttons.donateMenu.label}
                          </Button>
                        </RouterLink>
                      )}

                      {networkConfig === undefined ||
                      !networkConfig.buttons.accountMenu.visible ? (
                        <></>
                      ) : (
                        <RouterLink
                          to={networkConfig.buttons.accountMenu.url}
                          style={{ textDecoration: 'none' }}>
                          <Button
                            w="full"
                            variant={
                              path === networkConfig.buttons.accountMenu.url
                                ? 'solid'
                                : 'ghost'
                            }>
                            {networkConfig.buttons.accountMenu.label}
                          </Button>
                        </RouterLink>
                      )}

                      {networkConfig === undefined ||
                      !networkConfig.buttons.marketplaceMenu.visible ? (
                        <></>
                      ) : networkConfig.buttons.marketplaceMenu.url.substr(
                          0,
                          1
                        ) === '/' ? (
                        <RouterLink
                          to={networkConfig.buttons.marketplaceMenu.url}
                          style={{ textDecoration: 'none' }}>
                          <Button
                            w="full"
                            variant={
                              path === networkConfig.buttons.marketplaceMenu.url
                                ? 'solid'
                                : 'ghost'
                            }>
                            {networkConfig.buttons.marketplaceMenu.label}
                          </Button>
                        </RouterLink>
                      ) : (
                        <Button
                          w="full"
                          as="a"
                          href={networkConfig.buttons.marketplaceMenu.url}
                          target="_blank"
                          variant="ghost"
                          rightIcon={<ExternalLinkIcon />}>
                          {networkConfig.buttons.marketplaceMenu.label}
                        </Button>
                      )}

                      {networkConfig === undefined ||
                      !networkConfig.buttons.governanceMenu.visible ? (
                        <></>
                      ) : networkConfig.buttons.governanceMenu.url.substr(
                          0,
                          1
                        ) === '/' ? (
                        <RouterLink
                          to={networkConfig.buttons.governanceMenu.url}
                          style={{ textDecoration: 'none' }}>
                          <Button
                            variant={
                              path === networkConfig.buttons.governanceMenu.url
                                ? 'solid'
                                : 'ghost'
                            }>
                            {networkConfig.buttons.governanceMenu.label}
                          </Button>
                        </RouterLink>
                      ) : (
                        <Button
                          w="full"
                          as="a"
                          href={networkConfig.buttons.governanceMenu.url}
                          target="_blank"
                          variant="ghost"
                          rightIcon={<ExternalLinkIcon />}>
                          {networkConfig.buttons.governanceMenu.label}
                        </Button>
                      )}

                      {networkConfig === undefined ||
                      !networkConfig.buttons.bridgeMenu.visible ? (
                        <></>
                      ) : (
                        <Button
                          w="full"
                          as="a"
                          href={networkConfig.buttons.bridgeMenu.url}
                          target="_blank"
                          variant="ghost"
                          rightIcon={<ExternalLinkIcon />}>
                          {networkConfig.buttons.bridgeMenu.label}
                        </Button>
                      )}

                      <Box mt="3">
                        <LoginButton />
                      </Box>
                    </Box>
                  )}
                  <ToggleTheme />
                </VStack>
              </Box>
            </HStack>
          ) : (
            <></>
          )}
        </Flex>
      </chakra.header>
    </React.Fragment>
  );
}
