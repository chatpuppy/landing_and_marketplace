import React from 'react';
import {
  chakra,
  Box,
  Image,
  Flex,
  useColorModeValue,
  Button,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import BoxImageSrc from 'assets/mysteryBox.jpg';
import { useAuth } from 'contexts/AuthContext';
import { getNetworkConfig } from 'constants';

const EmptyList = () => {
  const navigate = useNavigate();
  const { currentNetwork } = useAuth();
  const networkConfig = getNetworkConfig(currentNetwork);

  return (
    <Flex
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      w="full"
      alignItems="center"
      justifyContent="center">
      <Box
        maxW="xs"
        mx="auto"
        h="lg"
        bg={useColorModeValue('white', 'gray.200')}
        shadow="lg"
        rounded="lg">
        <Image
          w="full"
          roundedTop="lg"
          fit="cover"
          src={BoxImageSrc}
          alt="Chatpuppy NFT"
        />
        <Box px={4} py={2}>
          <chakra.h1
            color={useColorModeValue('gray.800', 'gray.800')}
            fontWeight="bold"
            fontSize="xl"
            textTransform="uppercase">
            No NFTs Found
          </chakra.h1>
          <chakra.span
            color={useColorModeValue('gray.800', 'gray.800')}
            fontSize="md">
            Mint and unbox NFT only available on Ethereum
          </chakra.span>
        </Box>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          px={4}
          py={2}
          roundedBottom="lg">
          {networkConfig === undefined ||
          !networkConfig.buttons.mint.visible ? (
            <></>
          ) : (
            <Button
              mb={3}
              bgGradient="linear(to-r, brand.500, brand.500)"
              color={'gray.600'}
              _hover={{
                // bgGradient: 'linear(to-r, brand.150, brand.150)',
                boxShadow: 'xl',
              }}
              _active={{
                // bgGradient: 'linear(to-r, brand.200, brand.200)',
                boxShadow: 'xl',
              }}
              // _focus={{
              //     bg: "gray.600",
              // }}
              onClick={() => {
                navigate('/mint');
              }}>
              Mint
            </Button>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};

export default EmptyList;
