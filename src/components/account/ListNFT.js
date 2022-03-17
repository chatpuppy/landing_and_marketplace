import React, { useState, useRef } from 'react'
import {
    Modal, ModalOverlay, ModalContent,
    ModalHeader, ModalBody, Select,
    ModalCloseButton, Button, useDisclosure, useToast,
    useColorModeValue, FormControl, FormLabel, Input, Box
} from '@chakra-ui/react'
import { ethers } from "ethers";
import nft_core_abi from "abi/nft_core_abi.json"
import nft_marketplace_abi from "abi/nft_marketplace_abi.json"
import { useAuth } from 'contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import { TOKEN_ADDRESS, NFT_TOKEN_ADDRESS, MARKETPLACE_ADDRESS } from 'constants';
import ConfirmationProgress from '../ConfirmationProgress';

export default function ListNFT(props) {

    const { number } = props;
    let navigate = useNavigate();
    const toast = useToast();

    const [ isLoading, setIsLoading ] = useState(false);
    const [ token, setToken ] = useState(TOKEN_ADDRESS);
    const [ hiddenConfirmationProgress, setHiddenConfirmationProgress] = useState(true);
    const [ confirmationProgressData, setConfirmationProgressData ] = useState({value: 5, message: 'Start', step: 1});
  
    const { currentAccount, approved } = useAuth()
    const priceRef = useRef();

    const { isOpen, onOpen, onClose } = useDisclosure()
    const bg = useColorModeValue("gray.700", "gray.200")
    const buttonbg = useColorModeValue("white", "gray.900")

    const NFT_core_contract_address = NFT_TOKEN_ADDRESS;
    const NFT_marketplace_contract_address = MARKETPLACE_ADDRESS;
    
    const listNFT = async(e) => {
      e.preventDefault();
      setIsLoading(true);
      if(!currentAccount) return;
      try {
        const { ethereum } = window; //injected by metamask
        //connect to an ethereum node
        const provider = new ethers.providers.Web3Provider(ethereum); 
        //gets the account
        const signer = provider.getSigner();
        //connects with the contract
        const NFTMarketplaceConnectedContract = new ethers.Contract(NFT_marketplace_contract_address, nft_marketplace_abi, signer);
        const NFTCoreConnectedContract = new ethers.Contract(NFT_core_contract_address, nft_core_abi, signer)
        setHiddenConfirmationProgress(false);
        setConfirmationProgressData({step: '1/5', value: 20, message: 'Start...'});
        try {
          if(!approved) {
            const tx = await NFTCoreConnectedContract.setApprovalForAll(NFT_marketplace_contract_address, true)
            setConfirmationProgressData({step: '2/5', value: 40, message: 'Approving NFT...'});
            await tx.wait(2);
            setConfirmationProgressData({step: '3/5', value: 60, message: 'Approved, start listing...'});
          } else {
            setTimeout(() => {
              setConfirmationProgressData({step: '3/5', value: 60, message: 'Allowance checked, start listing...'});
            }, 1500);
          }
          const tx = await NFTMarketplaceConnectedContract.addOrder(number, token, ethers.utils.parseEther(''+priceRef.current.value))
          setConfirmationProgressData({step: '4/5', value: 80, message: 'List NFT and wait confirmation...'});
          await tx.wait(2);
          setConfirmationProgressData({step: '5/5', value: 100, message: 'You have got 2 confirmations, done!'})
          
          setTimeout(()=>{
            setIsLoading(false)
            onClose();
          }, 1500)
        } catch(err) {
          if(err.code === 4001) {
            toast({
              title: 'Sell NFT',
              description: 'User cancel the transaction',
              status: 'warning',
              duration: 4000,
              isClosable: true,
            });
            setHiddenConfirmationProgress(true);
            setIsLoading(false);
          } else {
            toast({
              title: 'Sell NFT error',
              description: `${err.data.message}`,
              status: 'error',
              duration: 4000,
              isClosable: true,
            })
            setIsLoading(false);
          }
        }
      } catch(err) {
          console.log(err)
      }
    }

    const handleTokenChange = (e) => {
        setToken(e.target.value)
    }

    return (
      <>
        <Button size="md" bg={buttonbg} color={bg} mb={3}
          fontWeight="bold" rounded="lg" textTransform="uppercase"
          _hover={{
            bg: "gray.500",
          }}
          _focus={{
            bg: "gray.600",
          }}
          onClick={onOpen}
          isLoading={isLoading}
        >
            Sell
        </Button>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>List NFT</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <form onSubmit={listNFT}>
                    <FormControl id="token" isRequired>
                        <FormLabel>Token Name</FormLabel>
                        <Select isReadOnly onChange={handleTokenChange} placeholder='CPT' value={TOKEN_ADDRESS}>

                        </Select>
                    </FormControl>
                    <FormControl id="price" isRequired my="2">
                        <FormLabel>Set Price</FormLabel>
                        <Input type="number" ref={priceRef} min="0" step="1"/>
                    </FormControl>
                    <Box h={5}></Box>
                    <ConfirmationProgress 
                      hidden={hiddenConfirmationProgress}
                      step={confirmationProgressData.step}
                      value={confirmationProgressData.value}
                      message={confirmationProgressData.message}
                    />
                    <Button isLoading={isLoading} mt="2" type="submit" size="lg" mb={3}>List</Button>
                </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    )
  }