import React from 'react';
import Design2 from 'assets/design2.png';
import Design3 from 'assets/design3.png';
import Design4 from 'assets/design4.png';
import {
  Box,
  chakra,
  SimpleGrid,
  useColorModeValue,
  Image,
} from '@chakra-ui/react';

export default function FeaturesLeftRight() {
  return (
    <Box bg={useColorModeValue('white', 'gray.800')} px={8} mx="auto" my="100">
      <SimpleGrid
        alignItems="start"
        columns={{ base: 1, md: 2 }}
        mx={{ base: '', md: '40' }}
        spacingY={{ base: 10, md: 32 }}
        spacingX={{ base: 10, md: 24 }}>
        <Box mt={{ lg: '100' }}>
          <chakra.h2
            mb={4}
            fontSize={{ base: '2xl', md: '4xl' }}
            fontWeight="bold"
            letterSpacing="tight"
            textAlign={{ base: 'center', md: 'left' }}
            color="brand.200"
            lineHeight={{ md: 'shorter' }}>
            End-to-end encryption for privacy
          </chakra.h2>
          <Box
            mb={5}
            textAlign="left"
            color={useColorModeValue('gray.600', 'gray.200')}
            fontSize={{ md: 'lg' }}>
            <ul>
              <li>
                Chatpuppy supports end-to-end encryption for all types of files,
                ensuring that the privacy of users information is fully
                protected.
              </li>
              <li>
                Decentralized end-to-end private messaging, no blockchain
                storage or gas fees
              </li>
              <li>
                Chatpuppy supports end-to-end encrypted group messaging with
                support for over 1000 members
              </li>
              <li>
                Chatpuppy ensures ultimate privacy by keeping your messages
                secure from servers, AI, companies, and governments
              </li>
            </ul>
          </Box>
        </Box>
        <Image
          src={Design4}
          h={{ base: '30vh', lg: '50vh' }}
          w={{ base: '100vw', lg: '50vw' }}
        />
      </SimpleGrid>
      <SimpleGrid
        alignItems="center"
        columns={{ base: 1, md: 2 }}
        flexDirection="column-reverse"
        mb="24"
        mx={{ base: '', md: '40' }}
        spacingY={{ base: 10, md: 32 }}
        spacingX={{ base: 10, md: 24 }}>
        <Box order={{ base: 'none', md: 2 }}>
          <chakra.h2
            mb={4}
            fontSize={{ base: '2xl', md: '4xl' }}
            fontWeight="extrabold"
            letterSpacing="tight"
            textAlign={{ base: 'center', md: 'left' }}
            color="brand.200"
            lineHeight={{ md: 'shorter' }}>
            Seamlessly integrated with crypto wallet for easy use
          </chakra.h2>
          <Box
            mb={5}
            textAlign="left"
            color={useColorModeValue('gray.600', 'gray.200')}
            fontSize={{ md: 'lg' }}>
            <ul>
              <li>
                Chatpuppy offers hassle-free chatting with no need for
                registration or login using personal information such as email
                or phone number
              </li>
              <li>
                No need to download any apps as you can chat directly on the
                website
              </li>
              <li>
                Easily interact with smart contracts by using simple commands
                directly in the chat box
              </li>
              <li>Send or recieve messages over different blockchains</li>
            </ul>
          </Box>
        </Box>
        <Image
          src={Design3}
          h={{ base: '30vh', lg: '50vh' }}
          w={{ base: '100vw', lg: '50vw' }}
        />
      </SimpleGrid>
      <SimpleGrid
        alignItems="start"
        columns={{ base: 1, md: 2 }}
        mb={24}
        mx={{ base: '', md: '40' }}
        spacingY={{ base: 10, md: 32 }}
        spacingX={{ base: 10, md: 24 }}>
        <Box mt={{ lg: '100' }}>
          <chakra.h2
            mb={4}
            fontSize={{ base: '2xl', md: '4xl' }}
            fontWeight="bold"
            letterSpacing="tight"
            textAlign={{ base: 'center', md: 'left' }}
            color="brand.200"
            lineHeight={{ md: 'shorter' }}>
            Built for NFT, crypto, and web3 communities
          </chakra.h2>
          <Box
            mb={5}
            textAlign="left"
            color={useColorModeValue('gray.600', 'gray.200')}
            fontSize={{ md: 'lg' }}>
            <ul>
              <li>
                Your avatar, username, and themes are all unique digital NFT
                assets
              </li>
              <li>Using 3rd-party NFTs as avatars in group chat</li>
              <li>
                Free to use, but advanced functionalities with NFT ownership
              </li>
            </ul>
          </Box>
        </Box>
        <Image
          src={Design2}
          h={{ base: '30vh', lg: '50vh' }}
          w={{ base: '100vw', lg: '50vw' }}
        />
      </SimpleGrid>
    </Box>
  );
}
