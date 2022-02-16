import React, { useState, useRef } from 'react'
import {
    Modal, ModalOverlay, ModalContent,
    ModalHeader, ModalBody, Select,
    ModalCloseButton, Button, useDisclosure, useToast,
    useColorModeValue, FormControl, FormLabel, Input
} from '@chakra-ui/react'
import { ethers } from "ethers";
import nft_core_abi from "abi/nft_core_abi.json"
import nft_marketplace_abi from "abi/nft_marketplace_abi.json"
import { useAuth } from 'contexts/AuthContext';
import { useNavigate } from "react-router-dom";

export default function ListNFT(props) {

    const { number } = props;
    let navigate = useNavigate();

    const toast = useToast();

    const [ isLoading, setIsLoading ] = useState(false);
    const [ token, setToken ] = useState("0x7C4b6E294Fd0ae77B6E1730CBEb1B8491859Ee24");

    const { currentAccount, approved } = useAuth()
    const priceRef = useRef();

    const { isOpen, onOpen, onClose } = useDisclosure()
    const bg = useColorModeValue("gray.700", "gray.200")
    const buttonbg = useColorModeValue("white", "gray.900")

    const NFT_core_contract_address = "0xAb50F84DC1c8Ef1464b6F29153E06280b38fA754"
    const NFT_marketplace_contract_address = "0xc60a6AE3a85838D3bAAf359219131B1e33103560"
    
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
          if(!approved) {
            await NFTCoreConnectedContract.setApprovalForAll("0xc60a6AE3a85838D3bAAf359219131B1e33103560", true)
          }
          await NFTMarketplaceConnectedContract.addOrder(number, token, priceRef.current.value)
          toast({
            title: 'Listed!',
            description: "Check marketplace!",
            status: 'success',
            duration: 4000,
            isClosable: true,
          })
          setTimeout(()=>{
            navigate("/marketplace", { replace: true });
          }, 5000)
        } catch(err) {
            console.log(err)
        } finally {
          setTimeout(()=>{
            setIsLoading(false)
          }, 5000)
        }
    }

    const handleTokenChange = (e) => {
        setToken(e.target.value)
    }

    return (
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
          isLoading={isLoading}
        >
            List
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
                        <Select isReadOnly onChange={handleTokenChange} placeholder='CPT' value="0x7C4b6E294Fd0ae77B6E1730CBEb1B8491859Ee24">

                        </Select>
                    </FormControl>
                    <FormControl id="price" isRequired my="2">
                        <FormLabel>Set Price</FormLabel>
                        <Input type="number" ref={priceRef} min="0" step="1"/>
                    </FormControl>
                    <Button isLoading={isLoading} mt="2" type="submit" size="lg">List</Button>
                </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    )
  }