import React from 'react';
import {
  Box,
  Container,
  Link,
  Stack,
  useColorModeValue,
  chakra,
  Image,
} from '@chakra-ui/react';
import BNBLogo from 'assets/bnb-logo.svg';
import ETHLogo from 'assets/eth-logo.svg';
// import AVAXLogo from "assets/avax-logo.svg"
import MATICLogo from 'assets/matic-logo.svg';
// import FTMLogo from "assets/ftm-logo.svg"

export default function SupportedNetworks() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.800')}
      color={useColorModeValue('gray.700', 'gray.200')}>
      <Container
        as={Stack}
        maxW={'6xl'}
        mt="10"
        py={{ base: '20', sm: '4' }}
        spacing={4}
        justify={'center'}
        align={'center'}>
        <chakra.p
          fontSize={{ base: '3xl', sm: '4xl' }}
          lineHeight="8"
          fontWeight="extrabold"
          letterSpacing="tight"
          color={useColorModeValue('gray.900')}>
          Supported Networks
        </chakra.p>
        <Stack direction={'row'} spacing={6}>
          <Link href={'#'}>
            <Image mt="4" h="40px" src={ETHLogo} />
          </Link>
          <Link href={'#'}>
            <Image mt="4" h="40px" src={MATICLogo} />
          </Link>
          <Link href={'#'}>
            <Image mt="4" h="40px" src={BNBLogo} />
          </Link>
          {/* <Link href={'#'}>
                <Image mt="4" h="40px" src={AVAXLogo}/>
            </Link> */}
          {/* <Link href={'#'}>
                <Image mt="4" h="40px" src={FTMLogo}/>
            </Link> */}
        </Stack>
      </Container>
    </Box>
  );
}
