import React, { useState } from "react";
import { Box, Flex, Image, Badge, useColorModeValue, Button, Center, useToast } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import BoxImageSrc from "assets/box.jpg"
import { ethers } from "ethers";
import abi from "abi/nft_manager_abi.json"

const MintModal = (props) => {

    const [ isLoading, setIsLoading ] = useState(false);

    const NFT_manager_contract_address = "0x0528E41841b8BEdD4293463FAa061DdFCC5E41bd"
    const toast = useToast()
    const { count } = props;

    const property = {
        imageUrl: BoxImageSrc,
        imageAlt: "Mystery Box",
        title: "Title Info about the product",
        formattedPrice: (count*0.1).toString()+" ETH ",
        rating: 4,
    };

    
    const mint = async() => {

        setIsLoading(true);

        try {
            const { ethereum } = window; //injected by metamask
            //connect to an ethereum node
            const provider = new ethers.providers.Web3Provider(ethereum); 
            //gets the account
            const signer = provider.getSigner(); 
            //connects with the contract
            const options = {value: ethers.utils.parseEther("0.01")}
            const NFTManagerConnectedContract = new ethers.Contract(NFT_manager_contract_address, abi, signer);
            NFTManagerConnectedContract.buyAndMint(1, options).then(()=>{
                toast({
                    title: 'Minted!',
                    description: "Got a Mystery Box!",
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                })
                setTimeout(()=>{
                    setIsLoading(false);
                    window.location.reload();
                }, 5000)
            });
            console.log("minted")
        } catch(err) {
            console.log(err)
        }

    }

    const mintAndUnbox = async() => {
        try {
            const { ethereum } = window; //injected by metamask
            //connect to an ethereum node
            const provider = new ethers.providers.Web3Provider(ethereum); 
            //gets the account
            const signer = provider.getSigner();
            //connects with the contract
            const options = {value: ethers.utils.parseEther("0.01")}
            const NFTManagerConnectedContract = new ethers.Contract(NFT_manager_contract_address, abi, signer);
            NFTManagerConnectedContract.buyMintAndUnbox(1, options).then(()=>{
                toast({
                    title: 'Minted & Unboxed!',
                    description: "Unboxed a Mystery Box!",
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                })
                setTimeout(()=>{
                    setIsLoading(false);
                    window.location.reload();
                }, 5000)
            });
            console.log("minted")
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
            Price: {property.formattedPrice}
            <Box as="span" color={useColorModeValue("gray.600", "gray.200")} fontSize="sm">
              for {count} NFT
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
            bgGradient="linear(to-r, red.400,pink.400)"
            color={'white'}
            _hover={{
                bgGradient: 'linear(to-r, red.400,pink.400)',
                boxShadow: 'xl',
            }}
            _active={{
                bgGradient: 'linear(to-r, red.200,pink.200)',
                boxShadow: 'xl',
            }}
            onClick={mint}
            isLoading={isLoading}
            >
            Mint
        </Button>
        <Center>Or</Center>
        <Button
            fontFamily={'heading'}
            my={2}
            w={'full'}
            bgGradient="linear(to-r, red.400,pink.400)"
            color={'white'}
            _hover={{
                bgGradient: 'linear(to-r, red.400,pink.400)',
                boxShadow: 'xl',
            }}
            _active={{
                bgGradient: 'linear(to-r, red.200,pink.200)',
                boxShadow: 'xl',
            }}
            onClick={mintAndUnbox}
            isLoading={isLoading}
            >
            Mint &#38; Unbox
        </Button>
      </Box>
    </Flex>
  );
};

export default MintModal;