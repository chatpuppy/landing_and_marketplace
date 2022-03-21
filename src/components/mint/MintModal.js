import React, { useState } from "react";
import { Box, Flex, Image, Badge, useColorModeValue, Button, Center, useToast, Spinner } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import BoxImageSrc from "assets/mysteryBox.jpg"
import { ethers } from "ethers";
import nft_manager_abi from "abi/nft_manager_abi";
import nft_manager_v2_abi from "abi/nft_manager_v2_abi.json"
import { useAuth } from "contexts/AuthContext";
import { NFT_MANAGER_ADDRESS, NFT_MANAGER_V2_ADDRESS, TOKEN_NAME} from 'constants';
import ConfirmationProgress from '../ConfirmationProgress';

const MintModal = (props) => {

    const [ isLoadingMint, setIsLoadingMint ] = useState(false);
    const [ isLoadingMintAndUnbox, setIsLoadingMintAndUnbox ] = useState(false);
    const { currentAccount, currentNetwork } = useAuth()
    const [ hiddenConfirmationProgress, setHiddenConfirmationProgress] = useState(true);
    const [ confirmationProgressData, setConfirmationProgressData ] = useState({value: 5, message: 'Start', step: 1});

    const NFT_manager_contract_address = NFT_MANAGER_V2_ADDRESS;
    const toast = useToast()
    const { count, boxPrice } = props;
    const id = 'toast'

    const property = {
        imageUrl: BoxImageSrc,
        imageAlt: "Mystery Box",
        title: "Title Info about the product",
        formattedPrice: (count*boxPrice).toString() + ` ${TOKEN_NAME} `,
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

      // if(currentNetwork!==42) {
      //   if (!toast.isActive(id)) {
      //     toast({
      //       id,
      //       title: 'Wrong network',
      //       description: "Please change network to Kovan Testnet",
      //       status: 'error',
      //       duration: 4000,
      //       isClosable: true,
      //     })
      //   }
      //   return;
      // }

      setIsLoadingMint(true);

      try {
          const { ethereum } = window; //injected by metamask
          //connect to an ethereum node
          const provider = new ethers.providers.Web3Provider(ethereum); 
          //gets the account
          const signer = provider.getSigner();
          //connects with the contract
          const options = {value: ethers.utils.parseEther((count*boxPrice).toString())}
          const NFTManagerConnectedContract = new ethers.Contract(NFT_manager_contract_address, nft_manager_v2_abi, signer);
          setHiddenConfirmationProgress(false);
          setConfirmationProgressData({step: '1/3', value: 33, message: 'Start...'})
          try {
            const tx = await NFTManagerConnectedContract.buyAndMint(options);
            console.log(tx);
            setConfirmationProgressData({step: '2/3', value: 66, message: 'Mint and wait confirmation...'});
            await tx.wait(2);
            setConfirmationProgressData({step: '3/3', value: 100, message: 'You have got 2 confirmations, done!'})
            setIsLoadingMint(false);
          } catch(err) {
            if(err.code === 4001) {
              // Cancel transaction
              toast({
                title: 'Buy and mint NFT',
                description: `User cancel the transaction`,
                status: 'warning',
                duration: 4000,
                isClosable: true,
              });
              setHiddenConfirmationProgress(true);
              setIsLoadingMint(false);
            } else {
              toast({
                title: 'Buy and mint NFT error',
                description: `${err.data.message}`,
                status: 'error',
                duration: 4000,
                isClosable: true,
              });
              setIsLoadingMint(false);  
            }
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

      // if(currentNetwork!==42) {
      //   if (!toast.isActive(id)) {
      //     toast({
      //       id,
      //       title: 'Wrong network',
      //       description: "Please change network to Kovan Testnet",
      //       status: 'error',
      //       duration: 4000,
      //       isClosable: true,
      //     })
      //   }
      //   return;
      // }

      setIsLoadingMintAndUnbox(true)
      
      try {
          const { ethereum } = window; //injected by metamask
          //connect to an ethereum node
          const provider = new ethers.providers.Web3Provider(ethereum); 
          //gets the account
          const signer = provider.getSigner();
          //connects with the contract
          const options = {value: ethers.utils.parseEther((count*boxPrice).toString())}
          const NFTManagerConnectedContract = new ethers.Contract(NFT_manager_contract_address, nft_manager_v2_abi, signer);
          try {
            await NFTManagerConnectedContract.buyMintAndUnbox(options);
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
            toast({
              title: 'Buy, mint and unbox NFT error',
              description: `${err.data.message}`,
              status: 'error',
              duration: 4000,
              isClosable: true,
            });
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
          rounded="lg"
        />

        <Box p="6">
          <Box fontWeight="semibold">
            Price: {boxPrice ? property.formattedPrice : <Spinner size='xs' mx="2"/>}
            <Box as="span" color={useColorModeValue("gray.600", "gray.200")} fontSize="sm">
              for {count} {count==='1'? "NFT": "NFTs"}
            </Box>
          </Box>
        </Box>
        <ConfirmationProgress 
          step={confirmationProgressData.step}
          message={confirmationProgressData.message}
          value={confirmationProgressData.value}
          hidden={hiddenConfirmationProgress}/>
        <Button
            fontFamily={'heading'}
            mb={3}
            w={'full'}
            h={12}
            bgGradient="linear(to-r, brand.200,brand.200)"
            color={'white'}
            // _hover={{
            //     bgGradient: 'linear(to-r, brand.150,brand.150)',
            //     boxShadow: 'xl',
            // }}
            // _active={{
            //     bgGradient: 'linear(to-r, brand.200,brand.200)',
            //     boxShadow: 'xl',
            // }}
            onClick={mint}
            isLoading={isLoadingMint}
            isDisabled={isLoadingMintAndUnbox}
            >
            Mint
        </Button>
      </Box>
    </Flex>
  );
};

export default MintModal;