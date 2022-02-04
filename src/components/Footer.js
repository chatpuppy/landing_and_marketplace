import React from 'react';
import {
    Box,
    chakra,
    Container,
    HStack,
    Image,
    Link,
    Stack,
    Text,
    useColorModeValue,
    VisuallyHidden,
  } from '@chakra-ui/react';
import { FaDiscord, FaTwitter, FaTelegramPlane, FaGithub } from 'react-icons/fa';
import Logo from "assets/logo.png"
  
  const SocialButton = ({
    children,
    label,
    href,
  }) => {
    return (
      <chakra.button
        bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
        rounded={'full'}
        w={8}
        h={8}
        cursor={'pointer'}
        as={'a'}
        href={href}
        display={'inline-flex'}
        alignItems={'center'}
        justifyContent={'center'}
        transition={'background 0.3s ease'}
        _hover={{
          bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
        }}>
        <VisuallyHidden>{label}</VisuallyHidden>
        {children}
      </chakra.button>
    );
  };
  
  export default function Footer() {
    return (
      <Box
        bg={useColorModeValue('gray.50', 'gray.900')}
        color={useColorModeValue('gray.700', 'gray.200')}>
        <Container as={Stack} maxW={'6xl'} py={4} spacing={4} justify={'center'} align={'center'}>
            <HStack>
            <Image src={Logo} h="35px"/> 
            <chakra.h1 fontSize="xl" fontWeight="medium" ml="2">
              ChatPuppy
            </chakra.h1>
            </HStack>
            <Stack direction={'row'} spacing={6}>
                <Link href={'#'}>Mint</Link>
                <Link href={'#'}>Marketplace</Link>
            </Stack>
        </Container>
        <Box
          borderTopWidth={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}>
          <Container
            as={Stack}
            maxW={'6xl'}
            py={4}
            direction={{ base: 'column', md: 'row' }}
            spacing={4}
            justify={{ base: 'center', md: 'space-between' }}
            align={{ base: 'center', md: 'center' }}>
            <Text>© 2022 ChatPuppy. All rights reserved</Text>
            <Stack direction={'row'} spacing={6}>
              <SocialButton label={'Twitter'} href={'#'}>
                <FaTwitter />
              </SocialButton>
              <SocialButton label={'YouTube'} href={'#'}>
                <FaDiscord />
              </SocialButton>
              <SocialButton label={'Telegram'} href={'#'}>
                <FaTelegramPlane />
              </SocialButton>
              <SocialButton label={'Github'} href={'#'}>
                <FaGithub />
              </SocialButton>
            </Stack>
          </Container>
        </Box>
      </Box>
    );
  }