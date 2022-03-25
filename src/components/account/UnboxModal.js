import React, { useState, useEffect } from "react";
import { Box, Text, Image, useColorModeValue, Button, useToast, SkeletonCircle, SkeletonText, Heading } from "@chakra-ui/react";
import { useAuth } from "contexts/AuthContext";
import { parseMetadata } from "avatar";
import mergeImages from 'merge-images';
import { NFT_STORAGE_TOKEN, NFT_DESCRIPTION, NFT_NAME, getNetworkConfig } from '../../constants';
import { NFTStorage, File } from 'nft.storage'
import { ethers } from "ethers";
import nft_core_abi from "abi/nft_core_abi.json"
import ConfirmationProgress from '../ConfirmationProgress';

const UnboxModal = (props) => {

    const [ isLoading, setIsLoading ] = useState(false);
    const [ nftMetadata, setNftMetadata ] = useState({ipnft: '', url: ''});
    const [ imageBase64, setImageBase64 ] = useState('');
    const [ parsedMd, setParsedMd ] = useState(null);
    const [ hiddenConfirmationProgress, setHiddenConfirmationProgress] = useState(true);
    const [ confirmationProgressData, setConfirmationProgressData ] = useState({value: 5, message: 'Start...', step: 1});
    const [ hideUploadButton, setHideUploadButton] = useState(false);
    const [ message1, setMessage1 ] = useState("Congrat! you have got a special NFT. If you want to trade it on OpenSea, please sign and Save metadata URI.");

    const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
    const { currentAccount, currentNetwork} = useAuth();

    const networkConfig = getNetworkConfig(currentNetwork);
    const NFT_core_contract_address = networkConfig.nftTokenAddress;

    const toast = useToast()
    const { artifacts, tokenId, dna, callback } = props;

    const uploadNFT = async(imageFile, pmd) => {
      const metadata = await client.store({
        name: NFT_NAME + ' #' + tokenId,
        description: NFT_DESCRIPTION,
        image: imageFile,
        image_url: imageFile,
        external_url: "https://chatpuppy.com",
        dna,
        artifacts: artifacts.toHexString(),
        level: pmd.level,
        experience: pmd.experience,
        rarity: pmd.rarity,
        attributes: pmd.properties,
      })
      setNftMetadata(metadata);
    }

    const dataURLtoFile = (dataurl, filename) => { 
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type: mime});
    }

    useEffect(() => {
      const parsedMetadata = parseMetadata(artifacts);
      if(parsedMetadata !== null) {
        setParsedMd(parsedMetadata);
        mergeImages(parsedMetadata.images).then(async(b64) => {
          const file = dataURLtoFile(b64, 'nft.png');
          await uploadNFT(file, parsedMetadata);
          setImageBase64(b64);
        });
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [artifacts])

    const updateMetadata = async() => {
      if(!currentAccount) return;
      if(nftMetadata.ipnft === '') return;
      setIsLoading(true);
      try {
        const { ethereum } = window; //injected by metamask
        //connect to an ethereum node
        const provider = new ethers.providers.Web3Provider(ethereum); 
        //gets the account
        const signer = provider.getSigner(); 
        //connects with the contract
        const NFTCoreConnectedContract = new ethers.Contract(NFT_core_contract_address, nft_core_abi, signer);

        try {
          setHiddenConfirmationProgress(false);
          setHideUploadButton(false);
          setConfirmationProgressData({step: '1/3', value: 33, message: 'Start...'});

          const tx = await NFTCoreConnectedContract.updateTokenURI(tokenId, nftMetadata.url);
          setConfirmationProgressData({step: '2/3', value: 66, message: 'Updating, waiting for confirmation...'});
          await tx.wait(2);
          setConfirmationProgressData({step: '3/3', value: 100, message: 'You have got 2 confirmations, update success...'});
          
          setIsLoading(false);
          setMessage1('You have saved your metadata to NFT, now you can trade it on OpenSea marketplace!');
          setHiddenConfirmationProgress(true);
          setHideUploadButton(true);
        } catch (err) {
          if(err.code === 4001) {
            toast({
              title: 'Upload NFT',
              description: 'User cancel the transaction',
              status: 'warning',
              duration: 4000,
              isClosable: true,
            });
            setHiddenConfirmationProgress(true);
            setIsLoading(false);
            callback(tokenId);
          } else {
            toast({
              title: 'Upload NFT',
              description: `Error ${err.data.message}`,
              status: 'error',
              duration: 4000,
              isClosable: true,
            })
            setHiddenConfirmationProgress(true);
            setIsLoading(false)    
            callback(tokenId);
          }
        }
      } catch (err) {
        console.log(err);
      }

    }

    return (
    <Box
      bg={useColorModeValue("white", "gray.700")}
      w="full"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        bg={useColorModeValue("white", "gray.700")}
        color={useColorModeValue("gray.600", "white")}
        p={1}
      >
        <Heading 
          mb={3} 
          fontSize="md" 
        >
        {imageBase64 !== '' ? 
          message1
          : "Please wait a few seconds until the image and metadata was uploaded to IPFS."}
        </Heading>
        {tokenId > 0 && imageBase64 !== '' ? 
        <Image
          rounded='lg'
          src={imageBase64}
          alt="Unboxed NFT"
        /> : 
        <Box w={"sm"} h={"sm"} border={1} rounded={10} mb={3} p={10}>
          <SkeletonCircle size={"200"}/>
          <SkeletonText mt='4' noOfLines={4} spacing='4'/>
        </Box>}

        {nftMetadata.ipnft === '' || parsedMd === null ? '' :
        <Box 
          // color={"gray.600"}
          // bg={"gray.100"}
          rounded={10}
          p={2}
          mt={5} 
          mb={5} 
          fontSize="md">
          <Text>TokenId: #{tokenId}</Text>
          <Text>Level: {parsedMd.level}</Text>
          <Text>Exp: {parsedMd.experience}</Text>
          <Text>Rarity: {parsedMd.rarity}</Text>
          <Text>Artifacts: {artifacts.toHexString()}</Text>
          {/* <Text>DNA: {dna}</Text> */}
          {/* <Text>IPFS Cid: {nftMetadata.ipnft}</Text> */}
          <Text color={"brand.200"}><a href={nftMetadata.url} target="_blank" rel="noreferrer">{nftMetadata.url.substr(0, 20) + "..." + nftMetadata.url.substr(nftMetadata.url.length - 20, 20)}</a></Text>
        </Box>
        }
      </Box>
      <Box>
        <ConfirmationProgress 
          hidden={hiddenConfirmationProgress}
          step={confirmationProgressData.step}
          value={confirmationProgressData.value}
          message={confirmationProgressData.message}
        />
      {hideUploadButton ? '' :
        <Button 
          w={'full'}
          isLoading={isLoading}
          isDisabled={nftMetadata.ipnft===''}
          onClick={updateMetadata}>
          Save metadata URI
        </Button>
      }
      </Box>
    </Box>
  );
};

export default UnboxModal;