import React, { useState } from "react";
import { chakra, Box, Image, Flex, useColorModeValue, Button, useToast } from "@chakra-ui/react";
import { useAuth } from "contexts/AuthContext";
import { ethers } from "ethers";
import nft_marketplace_abi from "abi/nft_marketplace_abi.json"

const ListedCard = (props) => {

    const { id, owner } = props;
    const { currentAccount } = useAuth();
    const bg = useColorModeValue("gray.700", "gray.200")
    const buttonbg = useColorModeValue("white", "gray.900")
    const NFT_marketplace_contract_address = "0xc60a6AE3a85838D3bAAf359219131B1e33103560"
    const [ isLoading, setIsLoading ] = useState(false);
    const toast = useToast()

    const unlistNFT = async() => {
      setIsLoading(true)
      if(!currentAccount) return;
      try {
          const { ethereum } = window; //injected by metamask
          //connect to an ethereum node
          const provider = new ethers.providers.Web3Provider(ethereum); 
          //gets the account
          const signer = provider.getSigner(); 
          //connects with the contract
          const NFTMarketplaceConnectedContract = new ethers.Contract(NFT_marketplace_contract_address, nft_marketplace_abi, signer);
          
          //need to get orderID instead of tokenID
          //await NFTMarketplaceConnectedContract.cancelOrder();
          toast({
            title: 'Unlisted!',
            description: "Check your account!",
            status: 'success',
            duration: 4000,
            isClosable: true,
          })
          setTimeout(()=>{
              window.location.reload();
          }, 5000)
      } catch(err) {
          console.log(err)
      } finally {
          setIsLoading(false)
      }
    }

    return (
    <Flex
        bg={useColorModeValue("white", "gray.800")}
        p={50}
        w="full"
        alignItems="center"
        justifyContent="center"
    >
        <Box
        maxW="xs"
        mx="auto"
        bg={useColorModeValue("gray.700","white")}
        shadow="lg"
        rounded="lg"
      >
        <Box px={4} py={2}>
          <chakra.h1
            color={useColorModeValue("white","gray.800")}
            fontWeight="bold"
            fontSize="3xl"
            textTransform="uppercase"
          >
            ID #{id}
          </chakra.h1>
          <chakra.p
            mt={1}
            fontSize="sm"
            color={useColorModeValue( "gray.400","gray.600")}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi quos
            quidem sequi illum facere recusandae voluptatibus
          </chakra.p>
        </Box>

        <Image
          w="full"
          fit="cover"
          h="40vh"
          mt={2}
          src={"https://www.larvalabs.com/cryptopunks/cryptopunk"+id+".png"}
          alt="NIKE AIR"
        />
        <Flex
          alignItems="center"
          justifyContent="space-between"
          px={4}
          py={2}
          bg={bg}
          roundedBottom="lg"
        >
            {currentAccount.toLowerCase()===owner.toLowerCase() ? 
            <>
            <Button size="md" bg={buttonbg} color={bg}
            fontWeight="bold" rounded="lg" textTransform="uppercase"
            _hover={{
                bg: "gray.500",
            }}
            _focus={{
                bg: "gray.600",
            }}
            >
                EDIT
            </Button>
            <Button size="md" bg={buttonbg} color={bg}
            fontWeight="bold" rounded="lg" textTransform="uppercase"
            _hover={{
                bg: "gray.500",
            }}
            _focus={{
                bg: "gray.600",
            }}
            onClick={unlistNFT}
            isLoading={isLoading}
            >
                UNLIST
            </Button>
            </>
            : <></>}
            
        </Flex>
      </Box>
    </Flex>
  );
};

export default ListedCard;