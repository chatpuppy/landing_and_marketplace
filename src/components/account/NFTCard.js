import React, { useState, useRef } from "react";
import { chakra, Box, Image, Flex, useColorModeValue, Button,
  AlertDialog, AlertDialogBody, AlertDialogFooter,
  AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useToast, Center
} from "@chakra-ui/react";
// import nft_manager_abi from "abi/nft_manager_abi.json";
import nft_manager_v2_abi from "abi/nft_manager_v2_abi.json";
import { useAuth } from "contexts/AuthContext";
import { ethers, utils, BigNumber } from "ethers";
import ListNFT from "./ListNFT";
import {NFT_MANAGER_ADDRESS, NFT_MANAGER_V2_ADDRESS} from 'constants';
import { sortLayer, mergeLayers } from "avatar";
import mergeImages from 'merge-images';

const NFTCard = (props) => {

  const NFT_manager_contract_address = NFT_MANAGER_V2_ADDRESS;
  const [ isLoading, setIsLoading ] = useState(false);
  const [ imageBase64, setImageBase64 ] = useState('');

  const toast = useToast()

  const { currentAccount } = useAuth()

  const { src, number, unboxed, metadata, dna } = props;
  const bg = useColorModeValue("gray.700", "gray.200")
  const buttonbg = useColorModeValue("white", "gray.900")

  const [isOpen, setIsOpen] = useState(false)
  const onClose = () => setIsOpen(false)
  const cancelRef = useRef()

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
      const NFTManagerConnectedContract = new ethers.Contract(NFT_manager_contract_address, nft_manager_v2_abi, signer);
      const _type = await NFTManagerConnectedContract.boxStatus(number);
      if(_type===2) {
        toast({
          title: 'Unbox NFT',
          description: "Unboxing in progress, refresh page after a few minutes",
          status: 'warning',
          duration: 4000,
          isClosable: true,
        })
        setIsLoading(false);
      } else if(_type===0) {
        try {
          await NFTManagerConnectedContract.unbox(number);
          toast({
            title: 'Transaction Succesful',
            description: "Unboxed your NFT",
            status: 'success',
            duration: 4000,
            isClosable: true,
          })
          setTimeout(()=>{
            window.location.reload();
          }, 3000)
        } catch(err) {
          toast({
            title: 'Unbox NFT error',
            description: `${err.data.message}`,
            status: 'error',
            duration: 4000,
            isClosable: true,
          })
          setIsLoading(false)
        }
      } else if(_type===1) {
        toast({
          title: 'Unbox NFT',
          description: "NFT mystery box has been unboxed",
          status: 'warning',
          duration: 4000,
          isClosable: true,
        })
        setIsLoading(false);
      }
    } catch(err) {
      console.log(err)
    }
  }

  const parseMetadata = (md) => {
    // Ex. 0x0622000602030a020501
    const sortedLayers = sortLayer(md.toHexString().substr(10, 12));
    const mergedLayers = mergeLayers(sortedLayers);
    if(mergedLayers.images.length === 0) return null;

    // console.log('images', mergedLayers.images);
    let level = 0;
    let experience = 0;
    let rarity = 1;
    for(let i = 0; i < mergedLayers.layers.length; i++) {
      level = level + mergedLayers.layers[i].level;
      experience = experience + mergedLayers.layers[i].experience;
      rarity = rarity * mergedLayers.layers[i].rarity / 1000000;
    }
    console.log(level, experience);
    return {
      metadata: md.toHexString(),
      level,
      experience,
      rarity: (rarity * 1000000).toFixed(4),
      images: mergedLayers.images,
      layers: mergedLayers.layers
    }
  }

  let parsedMetadata;
  if(unboxed) {
    parsedMetadata = parseMetadata(metadata);
    if(parsedMetadata !== null) {
      console.log("===", number, parsedMetadata.level, parsedMetadata.layers, parsedMetadata.images);
      mergeImages(parsedMetadata.images).then((b64) => {
        setImageBase64(b64);
      });
    }
  }

  return (
    <Flex
      bg={useColorModeValue("white", "gray.800")}
      p={10}
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
        <Image
          w="full"
          fit="cover"
          roundedTop="lg"
          src={unboxed && parsedMetadata !== null ? imageBase64 : src}
          alt="TITLE"
        />
        <Box px={4} py={2}>
          <chakra.h1
            color={useColorModeValue("white", "gray.800")}
            fontWeight="bold"
            fontSize="xl"
            textTransform="uppercase"
            textAlign="right"
          >
            Id #{number}
          </chakra.h1>
          <chakra.h1
            color={useColorModeValue("white", "gray.800")}
            fontSize="md"
            textTransform="uppercase"
          >
          {unboxed && parsedMetadata !== null ? 
          "Lvl: " + parsedMetadata.level : ''}
          </chakra.h1>
          <chakra.h1
            color={useColorModeValue("white", "gray.800")}
            fontSize="md"
            textTransform="uppercase"
          >
          {unboxed && parsedMetadata !== null? 
          "Exp: " + parsedMetadata.experience : ''}
          </chakra.h1>
          <chakra.h1
            color={useColorModeValue("white", "gray.800")}
            fontSize="md"
            textTransform="uppercase"
          >
          {unboxed && parsedMetadata !== null? 
          "RAT: " + parsedMetadata.rarity + ' per million' : ''}
          </chakra.h1>
          <chakra.h1
            color={useColorModeValue("white", "gray.500")}
            fontSize="sm"
            textTransform="uppercase"
          >
          {unboxed && parsedMetadata !== null ? 
           'Art: ' + parsedMetadata.metadata.substr(2) : ''}
          </chakra.h1>

        </Box>
        {unboxed ? 
        <Center my="2"
        >
          <ListNFT number={number}/>
        </Center>
        :
        <Flex
            alignItems="center"
            justifyContent="space-between"
            px={4}
            py={2}
            bg={bg}
            roundedBottom="lg"
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
          <ListNFT number={number}/>
        </Flex>
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