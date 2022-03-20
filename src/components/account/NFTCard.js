import React, { useState, useRef } from "react";
import { chakra, Box, Image, Flex, useColorModeValue, Button,
  AlertDialog, AlertDialogBody, AlertDialogFooter, ModalCloseButton,
  AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useToast, Center
} from "@chakra-ui/react";
import nft_manager_v2_abi from "abi/nft_manager_v2_abi.json";
import nft_core_abi from "abi/nft_core_abi.json"
import { useAuth } from "contexts/AuthContext";
import { ethers } from "ethers";
import ListNFT from "./ListNFT";
import {NFT_TOKEN_ADDRESS, NFT_MANAGER_V2_ADDRESS} from 'constants';
import { parseMetadata } from "avatar";
import mergeImages from 'merge-images';
import {BiHelpCircle} from 'react-icons/bi';
import ReactTooltip from 'react-tooltip';
import ConfirmationProgress from '../ConfirmationProgress';
import UnboxModal from './UnboxModal';

const NFTCard = (props) => {
  const NFT_manager_contract_address = NFT_MANAGER_V2_ADDRESS;
  const NFT_core_contract_address = NFT_TOKEN_ADDRESS;

  const [ isLoading, setIsLoading ] = useState(false);
  const [ imageBase64, setImageBase64 ] = useState('');
  const [ unboxModalParams, setUnboxModalParams] = useState({tokenId: 0, artifacts: 0, dna: ''})
  const [ hiddenConfirmationProgress, setHiddenConfirmationProgress] = useState(true);
  const [ confirmationProgressData, setConfirmationProgressData ] = useState({value: 5, message: 'Start', step: 1});

  const toast = useToast();
  const { currentAccount } = useAuth();
  const { src, number, unboxed, metadata, dna, uri } = props;
  const bg = useColorModeValue("white", "gray.200")
  const buttonbg = useColorModeValue("gray.900", "gray.900")

  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const onClose = () => setIsOpen(false);
  const onClose1 = () => setIsOpen1(false);
  const cancelRef = useRef();
  const cancelRef1 = useRef();

  const strLevel = "LEVEL: <br/>Sum of levels of each traits, <br/>higher means more value.";
  const strExperience = "EXPERIENCE: <br/>Sum of each trait's experience, <br/>higher means more value.";
  const strRarity = "RARITY: <br/>Probability of same NFT<br/> in 1,000,000 NFTs, <br/>lower means more value.";
  const strArtifacts = "ARTIFACTS: <br/>Artifacts of NFT on chain";
  const strMeta = "Metadata on IPFS <br/>If you did't upload while unboxing, <br/>you can upload to IPFS now";

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
      const NFTCoreConnectedContract = new ethers.Contract(NFT_core_contract_address, nft_core_abi, signer);
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
          setHiddenConfirmationProgress(false);
          setConfirmationProgressData({step: '1/4', value: 25, message: 'Start...'});

          // Testing
          // setIsOpen1(true);
          // const _metadata = await NFTCoreConnectedContract.tokenMetaData(50);
          // console.log(_metadata);
          // setUnboxModalParams({artifacts: _metadata._artifacts, tokenId: 50, dna: '0xaaa0000'}); 

          try {
            const tx = await NFTManagerConnectedContract.unbox(number);
            setConfirmationProgressData({step: '2/4', value: 50, message: 'Unboxing...'});
            await tx.wait(2);
            setConfirmationProgressData({step: '3/4', value: 75, message: 'Generating random NFT metadata for about 10 seconds...'});

            // Get NFT metadata every 1.5 second, to make sure the unboxed is fullfil
            let count = 0;
            const t = setInterval(async()=>{
              // const _type = await NFTManagerConnectedContract.boxStatus(number);
              const _metadata = await NFTCoreConnectedContract.tokenMetaData(number);
              console.log("_artifacts", _metadata._artifacts);
              if(_metadata._artifacts > 0 || count > 20) {
                // console.log(_metadata, number);
                // Popup unbox modal dialog box to upload to ipfs network, and show the picture and artifacts, level, experience, ipfs
                setUnboxModalParams({
                  artifacts: _metadata._artifacts, 
                  tokenId: number, 
                  dna: _metadata._dna
                }); 
                setIsOpen1(true);
                setConfirmationProgressData({step: '4/4', value: 100, message: 'Congrat! you have got an exclusive NFT'});
                clearInterval(t);
                setHiddenConfirmationProgress(true);
                setIsLoading(false);
                onClose();
              } else {
                count++;
              }
            }, 1500)
          } catch(err) {
            if(err.code === 4001) {
              toast({
                title: 'Unbox NFT',
                description: 'User cancel the transaction',
                status: 'warning',
                duration: 4000,
                isClosable: true,
              });
              setHiddenConfirmationProgress(true);
              setIsLoading(false);
            } else {
              toast({
                title: 'Unbox NFT',
                description: `Error ${err.data.message}`,
                status: 'error',
                duration: 4000,
                isClosable: true,
              })
              setIsLoading(false)    
            }
          }
        } catch(err) {
          console.log(err);
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

  let parsedMetadata;
  if(unboxed) {
    parsedMetadata = parseMetadata(metadata);
    if(parsedMetadata !== null) {
      mergeImages(parsedMetadata.images).then((b64) => {
        setImageBase64(b64);
      });
    }
  }

  const getUri = (uri) => {
    if(uri.substr(0, 5) === "ipfs:") return uri;
    else if(uri.substr(0, 2) === "Qm") return "ipfs://" + uri + "/metadata.json";
    else if(uri.substr(0, 7) === "bafyrei") return "ipfs://" + uri + "/metadata.json";
  }

  const uploadIPFS = () => {
    // ######

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
        bg={useColorModeValue("white", "gray.200")}
        shadow="lg"
        rounded="lg"
      >
        <Image
          w="full"
          fit="cover"
          roundedTop="lg"
          src={unboxed && parsedMetadata !== null ? (imageBase64 === '' ? './images/loading.jpg' : imageBase64) : src}
          alt="NFT Avatar"
        />
        <Box px={4} py={2}>
          <chakra.h1
            color={useColorModeValue("gray.800", "gray.800")}
            fontWeight="bold"
            fontSize="xl"
            textTransform="uppercase"
            textAlign="right"
          >
            Id #{number}
          </chakra.h1>
          <chakra.h1
            color={useColorModeValue("gray.800", "gray.800")}
            fontSize="sm"
            // textTransform="uppercase"
          >
          {unboxed && parsedMetadata !== null ? 
          <Flex>
            <BiHelpCircle fontSize="xs" data-tip={strLevel} data-for="level"/>
            &nbsp;Lvl: {parsedMetadata.level} 
          </Flex> : ''}
          </chakra.h1>
          <chakra.h1
            color={useColorModeValue("gray.800", "gray.800")}
            fontSize="sm"
            // textTransform="uppercase"
          >
          {unboxed && parsedMetadata !== null? 
          <Flex>
            <BiHelpCircle fontSize="xs" data-tip={strExperience} data-for="exp"/>
            &nbsp;Exp: {parsedMetadata.experience}
          </Flex> : ''}
          </chakra.h1>
          <chakra.h1
            color={useColorModeValue("gray.800", "gray.800")}
            fontSize="sm"
            // textTransform="uppercase"
          >
          {unboxed && parsedMetadata !== null? 
          <Flex>
            <BiHelpCircle fontSize="xs" data-tip={strRarity} data-for="rat"/>
            &nbsp;Rat: {parsedMetadata.rarity}
          </Flex>  : ''}
          </chakra.h1>

          <chakra.h1
            color={useColorModeValue("gray.800", "gray.800")}
            fontSize="sm"
            // textTransform="uppercase"
          >
          {unboxed && parsedMetadata !== null ? 
          <Flex>
            <BiHelpCircle fontSize="xs" data-tip={strArtifacts} data-for="artifacts"/>
            &nbsp;Art: {parsedMetadata.artifacts.substr(2)}
          </Flex> : ''}
          </chakra.h1>

          <chakra.h1
            color={useColorModeValue("gray.800", "gray.800")}
            fontSize="sm"
            // textTransform="uppercase"
          >
          {unboxed && parsedMetadata !== null ? 
          <Flex>
            <BiHelpCircle fontSize="xs" data-tip={strMeta} data-for="meta"/>
            &nbsp;Metadata: {uri === '' ? <Button size="sx" w={"50%"} fontSize={8} ml={3} mr={3} mt={1} onClick={uploadIPFS}>Upload to IPFS</Button> : <a href={getUri(uri)} target="_blank">&nbsp;&nbsp;Open in IPFS</a>}
          </Flex> : ''}
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
      <ReactTooltip id="level" effect="solid" multiline={true} />
      <ReactTooltip id="exp" effect="solid" multiline={true} />
      <ReactTooltip id="rat" effect="solid" multiline={true} />
      <ReactTooltip id="artifacts" effect="solid" multiline={true} />
      <ReactTooltip id="meta" effect="solid" multiline={true} />
      <AlertDialog
        isCentered={true}
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        // onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Open Mystery Box
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
              <Box h={5}></Box>
              <ConfirmationProgress 
                hidden={hiddenConfirmationProgress}
                step={confirmationProgressData.step}
                value={confirmationProgressData.value}
                message={confirmationProgressData.message}
              />
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
      <AlertDialog
        isCentered={true}
        isOpen={isOpen1}
        leastDestructiveRef={cancelRef1}
        // onClose={onClose1}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Unbox Result
            </AlertDialogHeader>
            <ModalCloseButton onClick={onClose1}/>
            <AlertDialogBody>
              <UnboxModal 
                tokenId={unboxModalParams.tokenId}
                artifacts={unboxModalParams.artifacts}
                dna={unboxModalParams.dna}
              />
            </AlertDialogBody>
            <AlertDialogFooter>
              {/* <Button ref={cancelRef1} onClick={onClose1}>
                Close
              </Button> */}
              {/* <Button isLoading={isUploading} onClick={upload} colorScheme='blue' ml={3}>
                Upload
              </Button>             */}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default NFTCard;