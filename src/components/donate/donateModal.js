import React, { useState } from "react";
import { Box, Flex, Image, Badge, useColorModeValue, Button, Center, useToast, Heading } from "@chakra-ui/react";
import donateABI from "abi/TokensVesting_abi";
import { TOKEN_VESTING_ADDRESS } from "constants";


import { ethers } from "ethers";
import { useAuth } from "contexts/AuthContext";

export const DonateModal = async (props) => {
    const [ isLoading, setIsLoading ] = useState(false);
    const { currentAccount, currentNetwork } = useAuth()
    const toast = useToast()
    const id = 'toast'

    const { amount } = props;

    if((!window.ethereum) || (!currentAccount)){
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
    setIsLoading(true);

    try {
        const { ethereum } = window; //injected by metamask
        const provider = new ethers.providers.Web3Provider(ethereum); 
        const signer = provider.getSigner(); 
        const TokenVestingContract = new ethers.Contract(TOKEN_VESTING_ADDRESS, donateABI, signer);
        try {

        } catch(err) {
            console.error('call contract', err)
            setIsLoading(false);
        }

    } catch(err) {
        console.error('Error Donate Modal', err)
    }

    return (
        // <Flex
        //   bg={useColorModeValue("white", "gray.700")}
        //   w="full"
        //   alignItems="center"
        //   justifyContent="center"
        // >
        //   <Box
        //     bg={useColorModeValue("white", "gray.700")}
        //     maxW="sm"
        //   >
        //     {/* <Image
        //       src={property.imageUrl}
        //       alt={property.imageAlt}
        //       roundedTop="lg"
        //     /> */}
    
        //     <Box p="6">
        //       <Box d="flex" alignItems="baseline">
        //         <Badge rounded="full" px="2" colorScheme="teal">
        //           New
        //         </Badge>
        //         <Box
        //           color="gray.500"
        //           fontWeight="semibold"
        //           letterSpacing="wide"
        //           fontSize="xs"
        //           textTransform="uppercase"
        //           ml="2"
        //         >
        //           Some Info
        //         </Box>
        //       </Box>
    
        //       <Box
        //         mt="1"
        //         as="h4"
        //         lineHeight="tight"
        //         isTruncated
        //       >
        //         {property.title}
        //       </Box>
    
        //       <Box fontWeight="semibold">
        //         Price: {property.formattedPrice}
        //         <Box as="span" color={useColorModeValue("gray.600", "gray.200")} fontSize="sm">
        //           for {count} NFT
        //         </Box>
        //       </Box>
    
        //       <Box d="flex" mt="2" alignItems="center">
        //         {Array(5)
        //           .fill("")
        //           .map((_, i) => (
        //             <StarIcon
        //               key={i}
        //               color={i < property.rating ? "teal.500" : "gray.300"}
        //             />
        //           ))}
        //         <Box as="span" ml="2" color={useColorModeValue("gray.600", "gray.200")} fontSize="sm">
        //           Rarity?
        //         </Box>
        //       </Box>
        //     </Box>
        //     <Button
        //         fontFamily={'heading'}
        //         mb={2}
        //         w={'full'}
        //         bgGradient="linear(to-r, red.400,pink.400)"
        //         color={'white'}
        //         _hover={{
        //             bgGradient: 'linear(to-r, red.400,pink.400)',
        //             boxShadow: 'xl',
        //         }}
        //         _active={{
        //             bgGradient: 'linear(to-r, red.200,pink.200)',
        //             boxShadow: 'xl',
        //         }}
        //         isLoading={isLoading}
        //         >
        //         Donate
        //     </Button>
        //   </Box>
        // </Flex>
        <Flex>
            <Heading>Donate Modal</Heading>
        </Flex>
    )
}