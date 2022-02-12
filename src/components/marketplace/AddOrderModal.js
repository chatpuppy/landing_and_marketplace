import React, { useState } from 'react'
import {
    Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalFooter, ModalBody, ModalCloseButton,
    useDisclosure, Button
  } from '@chakra-ui/react'
import { ethers } from "ethers";
import nft_marketplace_abi from "abi/nft_marketplace_abi.json"
import { useAuth } from 'contexts/AuthContext';

export default function AddOrderModal() {

    const NFT_marketplace_contract_address = "0xc60a6AE3a85838D3bAAf359219131B1e33103560"

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { currentAccount } = useAuth();
    const [ isLoading, setIsLoading ] = useState(false);

    const addOrder = async() => {
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
            await NFTMarketplaceConnectedContract.addOrder(22, '0x7C4b6E294Fd0ae77B6E1730CBEb1B8491859Ee24', 500000)
        } catch(err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
        <Button onClick={onOpen}>Open Modal</Button>

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                Hello
            </ModalBody>

            <ModalFooter>
                <Button isLoading={isLoading} colorScheme='blue' mr={3} onClick={addOrder}>
                    Add Order
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}