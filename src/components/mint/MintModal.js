import React, { useState } from "react";
import { Box, Flex, Image, Badge, useColorModeValue, Button, Center, useToast, Spinner } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import BoxImageSrc from "assets/mysteryBox.jpg"
import { ethers } from "ethers";
import nft_manager_abi from "abi/nft_manager_abi"
import { useAuth } from "contexts/AuthContext";

const MintModal = (props) => {

    const [ isLoadingMint, setIsLoadingMint ] = useState(false);
    const [ isLoadingMintAndUnbox, setIsLoadingMintAndUnbox ] = useState(false);
    const { currentAccount, currentNetwork } = useAuth()

    const NFT_manager_contract_address = "0x0528E41841b8BEdD4293463FAa061DdFCC5E41bd"
    const toast = useToast()
    const { count, boxPrice } = props;
    const id = 'toast'

    const property = {
        imageUrl: BoxImageSrc,
        imageAlt: "Mystery Box",
        title: "Title Info about the product",
        formattedPrice: (count*boxPrice).toString()+" ETH ",
        rating: 4,
    };

    const mint = async() => {

      if(!window.ethereum) {
        if (!toast.isActive(id)) {
          toast({
            id,
            title: 'No wallet found',
            description: "Please install Metamask",
            status: 'error',
            duration: 4000,
            isClosable: true,
          })
        }
        return;
      } 

      if(!currentAccount) {
        if (!toast.isActive(id)) {
          toast({
            id,
            title: 'Not connected',
            description: "Please connect an account",
            status: 'error',
            duration: 4000,
            isClosable: true,
          })
        }
        return;
      }

      if(currentNetwork!==42) {
        if (!toast.isActive(id)) {
          toast({
            id,
            title: 'Wrong network',
            description: "Please change network to Kovan Testnet",
            status: 'error',
            duration: 4000,
            isClosable: true,
          })
        }
        return;
      }

      setIsLoadingMint(true);

      try {
          const { ethereum } = window; //injected by metamask
          //connect to an ethereum node
          const provider = new ethers.providers.Web3Provider(ethereum); 
          //gets the account
          const signer = provider.getSigner(); 
          //connects with the contract
          const options = {value: ethers.utils.parseEther((count*boxPrice).toString())}
          const NFTManagerConnectedContract = new ethers.Contract(NFT_manager_contract_address, nft_manager_abi, signer);
          try {
            await NFTManagerConnectedContract.buyAndMint(1, options)
            toast({
              title: 'Minted!',
              description: "Got a Mystery Box!",
              status: 'success',
              duration: 4000,
              isClosable: true,
            })
            setTimeout(()=>{
                window.location.reload();
            }, 5000)
          } catch(err) {
            setIsLoadingMint(false);
          }
      } catch(err) {
          console.log(err)
      }
    }

    const mintAndUnbox = async() => {

      if(!window.ethereum) {
        if (!toast.isActive(id)) {
          toast({
            id,
            title: 'No wallet found',
            description: "Please install Metamask",
            status: 'error',
            duration: 4000,
            isClosable: true,
          })
        }
        return;
      } 

      if(!currentAccount) {
        if (!toast.isActive(id)) {
          toast({
            id,
            title: 'Not connected',
            description: "Please connect an account",
            status: 'error',
            duration: 4000,
            isClosable: true,
          })
        }
        return;
      }

      if(currentNetwork!==42) {
        if (!toast.isActive(id)) {
          toast({
            id,
            title: 'Wrong network',
            description: "Please change network to Kovan Testnet",
            status: 'error',
            duration: 4000,
            isClosable: true,
          })
        }
        return;
      }

      setIsLoadingMintAndUnbox(true)
      
      try {
          const { ethereum } = window; //injected by metamask
          //connect to an ethereum node
          const provider = new ethers.providers.Web3Provider(ethereum); 
          //gets the account
          const signer = provider.getSigner();
          //connects with the contract
          const options = {value: ethers.utils.parseEther((count*boxPrice).toString())}
          const NFTManagerConnectedContract = new ethers.Contract(NFT_manager_contract_address, nft_manager_abi, signer);
          try {
            await NFTManagerConnectedContract.buyMintAndUnbox(1, options);
            toast({
              title: 'Minted & Unboxed!',
              description: "Unboxed a Mystery Box!",
              status: 'success',
              duration: 4000,
              isClosable: true,
            })
            setTimeout(()=>{
                window.location.reload();
            }, 5000)
          } catch(err) {
            setIsLoadingMintAndUnbox(false);
          }
      } catch(err) {
          console.log(err)
      }
    }

    return (
    <Flex
      bg={useColorModeValue("white", "gray.700")}
      w="full"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        bg={useColorModeValue("white", "gray.700")}
        maxW="sm"
      >
        <Image
          src={property.imageUrl}
          alt={property.imageAlt}
          roundedTop="lg"
        />

        <Box p="6">
          <Box d="flex" alignItems="baseline">
            <Badge rounded="full" px="2" colorScheme="teal">
              New
            </Badge>
            <Box
              color="gray.500"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
              ml="2"
            >
              Some Info
            </Box>
          </Box>

          <Box
            mt="1"
            as="h4"
            lineHeight="tight"
            isTruncated
          >
            {property.title}
          </Box>

          <Box fontWeight="semibold">
            Price: {boxPrice ? property.formattedPrice : <Spinner size='xs' mx="2"/>}
            <Box as="span" color={useColorModeValue("gray.600", "gray.200")} fontSize="sm">
              for {count} {count==='1'? "NFT": "NFTs"}
            </Box>
          </Box>

          <Box d="flex" mt="2" alignItems="center">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <StarIcon
                  key={i}
                  color={i < property.rating ? "teal.500" : "gray.300"}
                />
              ))}
            <Box as="span" ml="2" color={useColorModeValue("gray.600", "gray.200")} fontSize="sm">
              Rarity?
            </Box>
          </Box>
        </Box>
        <Button
            fontFamily={'heading'}
            mb={2}
            w={'full'}
            h={12}
            bgGradient="linear(to-r, brand.200,brand.200)"
            color={'white'}
            _hover={{
                bgGradient: 'linear(to-r, brand.150,brand.150)',
                boxShadow: 'xl',
            }}
            _active={{
                bgGradient: 'linear(to-r, brand.200,brand.200)',
                boxShadow: 'xl',
            }}
            onClick={mint}
            isLoading={isLoadingMint}
            isDisabled={isLoadingMintAndUnbox}
            >
            Mint
        </Button>
        <Center>Or</Center>
        <Button
            fontFamily={'heading'}
            my={2}
            w={'full'}
            h={12}
            bgGradient="linear(to-r, brand.150,brand.150)"
            color={'white'}
            _hover={{
                bgGradient: 'linear(to-r, brand.150,brand.150)',
                boxShadow: 'xl',
            }}
            _active={{
                bgGradient: 'linear(to-r, brand.150,brand.150)',
                boxShadow: 'xl',
            }}
            onClick={mintAndUnbox}
            isLoading={isLoadingMintAndUnbox}
            isDisabled={isLoadingMint}
            >
            Mint &#38; Unbox
        </Button>
      </Box>
    </Flex>
  );
};

export default MintModal;