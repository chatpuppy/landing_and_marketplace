import React, { useState, useRef, useEffect } from "react";
import { chakra, Box, Image, Flex, useColorModeValue, Button,
  AlertDialog, AlertDialogBody, AlertDialogFooter, ModalCloseButton,
  AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useToast, Center, Text
} from "@chakra-ui/react";
import nft_manager_v2_abi from "abi/nft_manager_v2_abi.json";
import nft_core_abi from "abi/nft_core_abi.json"
import { useAuth } from "contexts/AuthContext";
import { ethers } from "ethers";
import ListNFT from "./ListNFT";
import { getNetworkConfig} from 'constants';
import { parseMetadata, getBackgroundId } from "avatar";
import mergeImages from 'merge-images';
import {BiHelpCircle} from 'react-icons/bi';
import ReactTooltip from 'react-tooltip';
import ConfirmationProgress from '../ConfirmationProgress';
import UnboxModal from './UnboxModal';

const NFTCard = (props) => {
  const [ isLoading, setIsLoading ] = useState(false);
  const [ imageBase64, setImageBase64 ] = useState('');
  const [ unboxModalParams, setUnboxModalParams] = useState({tokenId: 0, artifacts: 0, dna: ''})
  const [ hiddenConfirmationProgress, setHiddenConfirmationProgress] = useState(true);
  const [ confirmationProgressData, setConfirmationProgressData ] = useState({value: 5, message: 'Start', step: 1});

  const toast = useToast();
  const { currentAccount, currentNetwork } = useAuth();
  const { src, number, unboxed, metadata, dna, uri, callback } = props;
  const [tokenUri, setTokenUri] = useState(uri);
  const bg = useColorModeValue("white", "gray.200")
  const buttonbg = useColorModeValue("gray.900", "gray.900")

  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const [unboxModalType, setUnboxModalType] = useState(0); // unbox - 0, upload to IPFS - 1
  const onClose = () => setIsOpen(false);
  const onClose1 = () => {setIsOpen1(false); handleUnboxDone(number, unboxModalType)};
  const cancelRef = useRef();
  const cancelRef1 = useRef();

  const networkConfig = getNetworkConfig(currentNetwork);

  const NFT_manager_contract_address = networkConfig.supportChainlinkVRFV2 ? networkConfig.nftManagerV2Address : networkConfig.nftManagerAddress;
  const NFT_core_contract_address = networkConfig.nftTokenAddress;
  const unboxMaxWaitingSeconds = networkConfig.unboxMaxWaitingSeconds;
	const [ startCountback, setStartCountback ] = useState(false);
  const [ needSeconds, setNeedSeconds ] = useState(unboxMaxWaitingSeconds);

  const strLevel = "LEVEL: <br/>Sum of levels of each traits, <br/>higher means more value.";
  const strExperience = "EXPERIENCE: <br/>Sum of each trait's experience, <br/>higher means more value.";
  const strRarity = "RARITY: <br/>Probability of same NFT<br/> in 1,000,000 NFTs, <br/>lower means more value.";
  const strArtifacts = "ARTIFACTS: <br/>Artifacts of NFT on chain";
  const strMeta = "Metadata on IPFS <br/>If you did't upload while unboxing, <br/>you can upload to IPFS now";
	
  const unboxNFT = async() => {
    setIsLoading(true);
    if(!currentAccount || !networkConfig) return;
		if(NFT_core_contract_address === "" || NFT_core_contract_address === undefined) {
			toast({
				title: 'Unbox NFT',
				description: "NFT address is not set",
				status: 'error',
				duration: 4000,
				isClosable: true,
			})
			return;
		}
		if(NFT_manager_contract_address === "" || NFT_manager_contract_address === undefined) {
			toast({
				title: 'Unbox NFT',
				description: "NFT manager address is not set",
				status: 'error',
				duration: 4000,
				inClosable: true,
			})
			return;
		}

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

			// console.log("box type", number, _type);
      if(_type === 2) {
        toast({
          title: 'Unbox NFT',
          description: "Unboxing in progress, refresh page after a few minutes",
          status: 'warning',
          duration: 4000,
          isClosable: true,
        })
        setIsLoading(false);
      } else if(_type === 0) {
        try {
          setHiddenConfirmationProgress(false);
          setConfirmationProgressData({step: '1/4', value: 25, message: 'Start...'});

          try {
						let tx;
						// If mumbai testnet, use unbox(with chainlink), else using unboxV2(without chainlink)
						if(currentNetwork === 80001) tx = await NFTManagerConnectedContract.unbox(number);
						else tx = await NFTManagerConnectedContract.unboxV2(number);
            setConfirmationProgressData({step: '2/4', value: 50, message: 'Unboxing...'});
            await tx.wait(networkConfig.confirmationNumbers);
            setConfirmationProgressData({step: '3/4', value: 75, message: `Generating random NFT metadata by ChainLink, it will take around ${needSeconds}"`});

            // Get NFT metadata every 2 second, to make sure the unboxed is fullfil
            let count = 0;
						setStartCountback(true);
						setNeedSeconds(unboxMaxWaitingSeconds);
            const t = setInterval(async()=>{
              if(count % 2 === 1) {
                count++;
                return;
              }
              // Fetch data from chain every 2 seconds
              const _metadata = await NFTCoreConnectedContract.tokenMetaData(number);
              if(_metadata._artifacts > 0) {
                // Popup unbox modal dialog box to upload to ipfs network, and show the picture and artifacts, level, experience, ipfs
								setUnboxModalParams({
                  artifacts: _metadata._artifacts, 
                  tokenId: number, 
                  dna: _metadata._dna
                }); 
                setIsOpen1(true);
                setUnboxModalType(0);
                setConfirmationProgressData({step: '4/4', value: 100, message: 'Congrat! you have got an exclusive NFT'});
                clearInterval(t);
                setHiddenConfirmationProgress(true);
                setIsLoading(false);
                onClose(); // Close the current dialog box
              } else {
                count++;
              }
            }, 1000)
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

  const getUri = (_uri) => {
    if(_uri.substr(0, 5) === "ipfs:") return _uri;
    else if(_uri.substr(0, 2) === "Qm") return "ipfs://" + _uri + "/metadata.json";
    else if(_uri.substr(0, 7) === "bafyrei") return "ipfs://" + _uri + "/metadata.json";
  }

  const uploadIPFS = () => {
    setUnboxModalParams({
      artifacts: metadata, 
      tokenId: number, 
      dna
    }); 
    setIsOpen1(true);
    setUnboxModalType(1);
  }

  const handleUnboxDone = async(_tokenId, _type) => {
    if(_type === 1) {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum); 
      const signer = provider.getSigner(); 
      const NFTCoreConnectedContract = new ethers.Contract(NFT_core_contract_address, nft_core_abi, signer);
      const _tokenURI = await NFTCoreConnectedContract.tokenURI(number);
      setTokenUri(_tokenURI);
    }
    callback(_tokenId, _type);
  }

	useEffect(() => {
		if(startCountback && needSeconds > 0) {
			const interval = setInterval(() => {
				setNeedSeconds(needSeconds - 1);
				setConfirmationProgressData({step: '3/4', value: 75, message: `Generating random NFT metadata by ChainLink, it will take around ${needSeconds}"`});
			}, 1000);
			return () => clearInterval(interval);
		}
		if(needSeconds === 0) {
			const desc = "Unboxing is out of time, don't worry, you can open your list a few minutes later.";
			toast({
				title: 'Unbox NFT',
				description: desc,
				status: 'warning',
				duration: 4000,
				isClosable: true,
			})
			setConfirmationProgressData({step: '4/4', value: 100, message: "Unboxing is out of time, don't worry, you can open your list a few minutes later."});
			setIsLoading(false);
			setTimeout(() => onClose(), 3000);
		}
	}, [startCountback, needSeconds, toast])

  return (
    <Flex
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      w="full"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        maxW="lg"
        mx="auto"
        h={["lg", null, "lg"]}
        bg={useColorModeValue("white", "gray.200")}
        shadow="lg"
        rounded="lg"
      >
        <Image
          w="full"
          fit="cover"
          roundedTop="lg"
          src={unboxed && parsedMetadata !== null ? (imageBase64 === '' ? `./images/loading${getBackgroundId(metadata)}.jpg` : imageBase64) : src}
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
        </Box>
        <Box px={4} mt={-6}>
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
            &nbsp;Metadata: {tokenUri === '' ? 
              <Button size="sx" w={"50%"} fontSize={8} ml={3} mr={3} mt={1} onClick={uploadIPFS}>Upload to IPFS</Button> 
              : <a href={getUri(tokenUri)} target="_blank" rel="noreferrer">&nbsp;&nbsp;Open in IPFS</a>}
          </Flex> : ''}
          </chakra.h1>

        </Box>
        {unboxed ? 
        <Center my="2"
        >
          <ListNFT 
            number={number}
            callback={(tokenId) => callback(tokenId, unboxModalType)}
          />
        </Center>
        :
        <Box>
        <Text ml={5} mr={5} mt={5} color={"gray.500"}>
            Click UNBOX button to open this mystery box, or click SELL button to list it on marketplace.
        </Text>
        <Flex
            alignItems="center"
            justifyContent="space-between"
            px={4}
            py={2}
            bg={bg}
            roundedBottom="lg"
        >
					{networkConfig !== undefined && networkConfig.buttons.unbox.visible ? 
          <Button 
            size="md" 
            bg={buttonbg} 
            color={bg}
            fontWeight="bold" rounded="lg" textTransform="uppercase"
            bgGradient="linear(to-r, brand.500,brand.500)"
            _hover={{
              boxShadow: 'xl',
            }}
            _active={{
              boxShadow: 'xl',
            }}
            onClick={() => setIsOpen(true)}
          >
            Unbox
          </Button> : <></>}

          <ListNFT 
            number={number}
            callback={(tokenId) => callback(tokenId, unboxModalType)}
          />
        </Flex>
        </Box>
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
        closeOnOverlayClick={false}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Open Mystery Box
            </AlertDialogHeader>
            <ModalCloseButton />
            <AlertDialogBody>
              It'll take around one minute to open/unbox it, please click Unbox Button if you want to continue.
              <Box h={5}></Box>
              <ConfirmationProgress 
                hidden={hiddenConfirmationProgress}
                step={confirmationProgressData.step}
                value={confirmationProgressData.value}
                message={confirmationProgressData.message}
              />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button isLoading={isLoading} onClick={unboxNFT} colorScheme='blue' ml={3}>
                Unbox
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isCentered
        isOpen={isOpen1}
        leastDestructiveRef={cancelRef1}
        closeOnOverlayClick={false}
        onClose={onClose1}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              NFT Avatar
            </AlertDialogHeader>
            <ModalCloseButton/>
            <AlertDialogBody>
              <UnboxModal 
                tokenId={unboxModalParams.tokenId}
                artifacts={unboxModalParams.artifacts}
                dna={unboxModalParams.dna}
                callback={(tokenId) => handleUnboxDone(tokenId, unboxModalType)}
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