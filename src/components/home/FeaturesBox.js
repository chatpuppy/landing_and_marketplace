import React from "react";
import {
  chakra,
  Box,
  SimpleGrid,
  Flex,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { FaWallet, FaRegFileCode } from "react-icons/fa";
import { FiCoffee } from "react-icons/fi";
import { SiWeb3Dotjs } from "react-icons/si";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { BsChatDots, BsShare } from "react-icons/bs";
import {
  MdFollowTheSigns,
  MdOutlineAttachEmail,
  MdOutlinePrivacyTip,
  MdOutlineNoEncryption
} from "react-icons/md";
import { BiGroup, BiCrown } from "react-icons/bi";
import { RiExchangeLine } from "react-icons/ri";
import { ImEmbed2 } from "react-icons/im";
import { GiCrossedChains } from "react-icons/gi";
import { CgServerless } from "react-icons/cg";

export default function FeaturesBox() {
  const Feature = (props) => {
    return (
      <Box>
        <Flex
          alignItems="center"
          justifyContent="center"
          w={20}
          h={20}
          color={useColorModeValue("black", "gray.200")}
        >
          <Icon
            boxSize={7}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            {props.icon}
          </Icon>
        </Flex>
        <chakra.h3
          fontWeight="semibold"
          lineHeight="shorter"
          color={useColorModeValue("gray.900")}
        >
          {props.title}
        </chakra.h3>
        <chakra.p
          fontSize="sm"
          color={useColorModeValue("gray.500", "gray.400")}
        >
          
        </chakra.p>
      </Box>
    );
  };
  return (
    <Flex
      bg={useColorModeValue("#F9FAFB", "gray.800")}
      p={{base: "0", md: "20"}}
      w="auto"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        px={8}
        p={20}
        mx="auto"
        bg={useColorModeValue("white", "gray.800")}
        shadow="xl"
        rounded="xl"
      >
        <Box textAlign={{ lg: "center" }}>
          <chakra.p
            fontSize={{ base: "3xl", sm: "4xl" }}
            lineHeight="8"
            fontWeight="extrabold"
            letterSpacing="tight"
            color={useColorModeValue("gray.900")}
          >
            Features
          </chakra.p>
        </Box>
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3, lg: 5 }}
          spacingX={{ base: 16, lg: 24 }}
          spacingY={10}
          mt={10}
        >
          <Feature
            title="Wallet to Wallet Chat"
            icon={
              <FaWallet />
            }
          >
          </Feature>

          <Feature
            title="Web3 Dapp"
            icon={
              <SiWeb3Dotjs />
            }
          >
          </Feature>

          <Feature
            title="No register and login"
            icon={
              <MdFollowTheSigns />
            }
          >
          </Feature>

          <Feature
            title="No emails, phone numbers login"
            icon={
              <MdOutlineAttachEmail />
            }
          >
          </Feature>
          <Feature
            title="No download and install APP"
            icon={
              <AiOutlineAppstoreAdd />
            }
          >
          </Feature>
          <Feature
            title="One click to chat"
            icon={
              <BsChatDots />
            }
          >
          </Feature>
          <Feature
            title="Share chat link to everyone"
            icon={
              <BsShare />
            }
          >
          </Feature>
          <Feature
            title="Group chat &#38; private messaging"
            icon={
              <BiGroup />
            }
          >
          </Feature>
          <Feature
            title="No GAS fee"
            icon={
              <FiCoffee />
            }
          >
          </Feature>
          <Feature
            title="Your NFTs is your avatar and username"
            icon={
              <BiCrown />
            }
          >
          </Feature>
          <Feature
            title="NFTs are transferable"
            icon={
              <RiExchangeLine />
            }
          >
          </Feature>
          <Feature
            title="Embeded with Defi, blockchain games"
            icon={
              <ImEmbed2 />
            }
          >
          </Feature>
          <Feature
            title="Chat over different blockchains"
            icon={
              <GiCrossedChains />
            }
          >
          </Feature>
          <Feature
            color="red"
            title="Interacting with smart contracts while chatting"
            icon={
              <FaRegFileCode />
            }
          >
          </Feature>
          <Feature
            color="red"
            title="Super privacy protection"
            icon={
              <MdOutlinePrivacyTip />
            }
          >
          </Feature>
          <Feature
            title="Decentralized and serverless"
            icon={
              <CgServerless />
            }
          >
          </Feature>
          <Feature
            title="Encrypted and mixed messaging"
            icon={
              <MdOutlineNoEncryption />
            }
          >
          </Feature>
        </SimpleGrid>
      </Box>
    </Flex>
  );
}