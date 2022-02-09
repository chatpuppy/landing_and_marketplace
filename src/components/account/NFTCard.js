import React, { useState } from "react";
import { chakra, Box, Image, Flex, useColorModeValue, Center, Button,
  AlertDialog, AlertDialogBody, AlertDialogFooter,
  AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useToast
} from "@chakra-ui/react";
import nft_manager_abi from "abi/nft_manager_abi.json";
import { useAuth } from "contexts/AuthContext";
import { ethers } from "ethers";

const NFTCard = (props) => {

  const NFT_manager_contract_address = "0x0528E41841b8BEdD4293463FAa061DdFCC5E41bd";
  const [ isLoading, setIsLoading ] = useState(false);

  const toast = useToast()

  const { currentAccount } = useAuth()

  const { src, number, unboxed } = props;
  const bg = useColorModeValue("gray.700", "gray.200")
  const buttonbg = useColorModeValue("white", "gray.900")

  const [isOpen, setIsOpen] = React.useState(false)
  const onClose = () => setIsOpen(false)
  const cancelRef = React.useRef()

  const unboxNFT = async() => {
    setIsLoading(true);
    if(!currentAccount) return;
    try {
      const { ethereum } = window; //injected by metamask
      //connect to an ethereum node
      const provider = new ethers.providers.Web3Provider(ethereum); 
      //gets the account
      const signer = provider.getSigner(); 
      //connects with the contract
      const NFTManagerConnectedContract = new ethers.Contract(NFT_manager_contract_address, nft_manager_abi, signer);
      const _type = await NFTManagerConnectedContract.boxStatus(number);
      if(_type===2) {
        toast({
          title: 'In Progress',
          description: "Refresh page after a few minutes",
          status: 'warning',
          duration: 2000,
          isClosable: true,
        })
      } else if(_type===0) {
        await NFTManagerConnectedContract.unbox(number);
        toast({
          title: 'Transaction Succesful',
          description: "Unboxed your NFT",
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        setTimeout(()=>{
          setIsLoading(false);
          window.location.reload();
        }, 3000)
      } else if(_type===1) {
        toast({
          title: 'Error',
          description: "NFT already unboxed",
          status: 'error',
          duration: 2000,
          isClosable: true,
        })
      }
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
      bg={useColorModeValue("gray.700", "gray.200")}
      shadow="lg"
      rounded="lg"
    >
      <Box px={4} py={2}>
        <chakra.h1
          color={useColorModeValue("white", "gray.800")}
          fontWeight="bold"
          fontSize="3xl"
          textTransform="uppercase"
        >
          ID #{number}
        </chakra.h1>
        <chakra.p
          mt={1}
          fontSize="sm"
          color={useColorModeValue("white", "gray.900")}
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
        src={src}
        alt="TITLE"
        roundedBottom={unboxed ? "lg" : ""}
      />
      {unboxed ? 
      <></>
      :
      <Center py={2} bg={bg} roundedBottom="lg"
      >
        <Button size="md" bg={buttonbg} color={bg}
          fontWeight="bold" rounded="lg" textTransform="uppercase"
          _hover={{
            bg: "gray.500",
          }}
          _focus={{
            bg: "gray.600",
          }}
          onClick={() => setIsOpen(true)}
        >
          Unbox
        </Button>
      </Center>
      }
    </Box>
    <AlertDialog
      isCentered={true}
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            Reveal Mystery Box
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You can't undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button isLoading={isLoading} ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button isLoading={isLoading} onClick={unboxNFT} colorScheme='blue' ml={3}>
              Unbox
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  </Flex>

    
  );
};

export default NFTCard;