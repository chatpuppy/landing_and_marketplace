import React from "react";
import Design2 from "assets/design2.png"
import Design3 from "assets/design3.png"

import {
  Box, chakra, SimpleGrid, useColorModeValue,
  Image
} from "@chakra-ui/react";

export default function FeaturesLeftRight() {
  return (
      <Box
        bg={useColorModeValue("white", "gray.800")}
        px={8}
        mx="auto"
      >
        <SimpleGrid
          alignItems="start"
          columns={{ base: 1, md: 2 }}
          mb={24}
          mx={{base: "", md:"40"}}
          spacingY={{ base: 10, md: 32 }}
          spacingX={{ base: 10, md: 24 }}
        >
          <Box mt={{ lg: "100"}}>
            <chakra.h2
              mb={4}
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="bold"
              letterSpacing="tight"
              textAlign={{ base: "center", md: "left" }}
              color="brand.200"
              lineHeight={{ md: "shorter" }}
            >
              NFT-Based
            </chakra.h2>
            <chakra.p
              mb={5}
              textAlign={{ base: "center", sm: "left" }}
              color={useColorModeValue("gray.600", "gray.200")}
              fontSize={{ md: "lg" }}
            >
              <ul>
                <li>All of your avatar, username, themes are your own digital NFT onchain assets.</li>
                <li>All NFTs can be upgraded and are tradable on marketplace or opensea.</li>
                <li>Integrating 3rd-party NFTs. Ex. use CryptoPunk as avatar or artwork NFTs as themes.</li>
                <li>Everyone can use, but NFT holders have advanced functionalities. Ex. minting own NFT avatar from your photos.</li>
              </ul>
            </chakra.p>
          </Box>
          <Image
          src={Design2} h={{base: "40vh", lg: "50vh"}} w={{base: "100vw", lg: "50vw"}}/>
        </SimpleGrid>
        <SimpleGrid
          alignItems="center"
          columns={{ base: 1, md: 2 }}
          flexDirection="column-reverse"
          mb={{base: "0", md: "24"}}
          mx={{base: "", md:"40"}}
          spacingY={{ base: 10, md: 32 }}
          spacingX={{ base: 10, md: 24 }}
        >
          <Box order={{ base: "none", md: 2 }}>
            <chakra.h2
              mb={4}
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="extrabold"
              letterSpacing="tight"
              textAlign={{ base: "center", md: "left" }}
              color="brand.200"
              lineHeight={{ md: "shorter" }}
            >
              Wallet-to-Wallet Instant Messaging &#38; Interact with Smart Contracts
            </chakra.h2>
            <chakra.p
              mb={5}
              textAlign={{ base: "center", sm: "left" }}
              color={useColorModeValue("gray.600", "gray.200")}
              fontSize={{ md: "lg" }}
            >
              <ul>
                <li>No need register or login by email, phone number or any of your identity. No need to download any APPs, just chat on website or in Dapp by metamask/walletconnect etc.</li>
                <li>Group chat and private messages are supported.</li>
                <li>No messages are saved on blockchains, no gas fee, fully peer-to-peer instant messaging.</li>
                <li>Send or recieve messages over different blockchains.</li>
              </ul>
            </chakra.p>
          </Box>
          <Image
          src={Design3} h={{base: "40vh", lg: "50vh"}} w={{base: "100vw", lg: "50vw"}}/>
        </SimpleGrid>
        <SimpleGrid
          alignItems="start"
          columns={{ base: 1, md: 2 }}
          mb={24}
          mx={{base: "", md:"40"}}
          spacingY={{ base: 10, md: 32 }}
          spacingX={{ base: 10, md: 24 }}
        >
          <Box mt={{ lg: "100"}}>
            <chakra.h2
              mb={4}
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="bold"
              letterSpacing="tight"
              textAlign={{ base: "center", md: "left" }}
              color="brand.200"
              lineHeight={{ md: "shorter" }}
            >
              Super Privacy Protection &#38; Decentralized
            </chakra.h2>
            <chakra.p
              mb={5}
              textAlign={{ base: "center", sm: "left" }}
              color={useColorModeValue("gray.600", "gray.200")}
              fontSize={{ md: "lg" }}
            >
              <ul>
                <li>Gateways of messaging are fully decentralized, each message is encrypted, mixed, and sent through random gateways all over the world</li>
                <li>Quantum-secured encrypt algorithm make your messages super safe.</li>
                <li>No servers, AI, companies or goverments can see, inercept, save, anyalyze or modify your messages.</li>
              </ul>
            </chakra.p>
          </Box>
          <Image
          src={Design2} h={{base: "40vh", lg: "50vh"}} w={{base: "100vw", lg: "50vw"}}/>
        </SimpleGrid>
      </Box>
  );
}