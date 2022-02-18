import React, { useState, useRef } from "react";
import { chakra, Box, Image, Flex, useColorModeValue, Button, useToast,
  Modal, ModalOverlay, ModalContent, ModalHeader, 
  ModalBody, ModalCloseButton, useDisclosure,
  FormControl, FormLabel, Input
} from "@chakra-ui/react";
import { useAuth } from "contexts/AuthContext";
import { ethers } from "ethers";
import nft_marketplace_abi from "abi/nft_marketplace_abi.json"
import { useNavigate } from "react-router-dom";
import BuyDialog from "./BuyDialog";

const ListedCard = (props) => {

  let navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { tokenId, owner, orderId, price } = props;
  const { currentAccount } = useAuth();
  const bg = useColorModeValue("gray.700", "gray.200")
  const buttonbg = useColorModeValue("white", "gray.900")
  const NFT_marketplace_contract_address = "0xc60a6AE3a85838D3bAAf359219131B1e33103560"
  const [ isLoading, setIsLoading ] = useState(false);
  const toast = useToast()
  const priceRef = useRef();

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
        await NFTMarketplaceConnectedContract.cancelOrder(orderId);
        toast({
          title: 'Unlisted!',
          description: "Check your account!",
          status: 'success',
          duration: 4000,
          isClosable: true,
        })
        setTimeout(()=>{
            navigate("/account", { replace: true });
        }, 5000)
    } catch(err) {
        console.log(err)
    } finally {
      setTimeout(()=>{
        setIsLoading(false)
      }, 5000)
    }
  }

  const updatePrice = async(e) => {
    e.preventDefault()
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
        await NFTMarketplaceConnectedContract.updatePrice(orderId, priceRef.current.value)
        toast({
          title: 'Updated!',
          description: "Price has been updated!",
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
      setTimeout(()=>{
        setIsLoading(false)
      }, 5000)
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
      <Image
        w="full"
        roundedTop="lg"
        fit="cover"
        h="40vh"
        src={"https://www.larvalabs.com/cryptopunks/cryptopunk"+tokenId+".png"}
        alt="NIKE AIR"
      />
      <Box px={4} py={2} bg={bg}>
        <chakra.h1
          color={useColorModeValue("white","gray.800")}
          fontWeight="bold"
          fontSize="3xl"
          textTransform="uppercase"
        >
          ID #{tokenId}
        </chakra.h1>
        <chakra.span
          color={useColorModeValue("white","gray.800")}
          fontSize="xl"
        >
          Price: {price} CPT
        </chakra.span>
      </Box>
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
          onClick={onOpen}
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
          : 
          <BuyDialog price={price} tokenId={tokenId} orderId={orderId}/>
          }
        </Flex>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Price</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={updatePrice}>
                <FormControl id="price" isRequired mb="2">
                    <FormLabel>Price</FormLabel>
                    <Input type="number" ref={priceRef} min="0" step="1"/>
                </FormControl>
                <Button colorScheme="blue" isLoading={isLoading} my="2" type="submit" size="md">Update</Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default ListedCard;