import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
    AlertDialog, AlertDialogBody, AlertDialogFooter,
    AlertDialogHeader, AlertDialogContent, AlertDialogOverlay,
    Button, useToast, Progress,
} from '@chakra-ui/react'
import cpt_abi from "abi/cpt_abi.json"
import nft_marketplace_abi from "abi/nft_marketplace_abi.json"
import { ethers } from "ethers";
import { useAuth } from 'contexts/AuthContext';

export default function BuyDialog(props) {

    const cpt_contract_address = '0x7C4b6E294Fd0ae77B6E1730CBEb1B8491859Ee24'
    const NFT_marketplace_contract_address = "0xc60a6AE3a85838D3bAAf359219131B1e33103560"

    const { currentAccount } = useAuth()
    const toast = useToast();
    const { tokenId, price, orderId } = props;
    const [ isLoading, setIsLoading ] = useState(false);
    const [isOpen, setIsOpen] = useState(false)
    const onClose = () => setIsOpen(false)
    const cancelRef = useRef()

    const [ approved, setApproved ] = useState(false)
    const buyNFT = async() => {
        setIsLoading(true)
        if(!currentAccount) return;
        try {
            const { ethereum } = window; //injected by metamask
            //connect to an ethereum node
            const provider = new ethers.providers.Web3Provider(ethereum); 
            //gets the account
            const signer = provider.getSigner();
            //connects with the contract
            const CPTConnectedContract = new ethers.Contract(cpt_contract_address, cpt_abi, signer);
            const NFTMarketplaceConnectedContract = new ethers.Contract(NFT_marketplace_contract_address, nft_marketplace_abi, signer);
            let _bal = await CPTConnectedContract.balanceOf(currentAccount)
            _bal = parseInt(_bal["_hex"], 16)
            if(_bal<parseInt(price["_hex"], 16)) {
                toast({
                    title: 'Error!',
                    description: "Token balance is low!",
                    status: 'warning',
                    duration: 4000,
                    isClosable: true,
                })
                return;
            }
            if(!approved) {
                await CPTConnectedContract.approve("0xc60a6AE3a85838D3bAAf359219131B1e33103560", price);
                setApproved(true);
                setTimeout(() => {
                    setIsLoading(false)
                }, 7500);
                return;
            }
            await NFTMarketplaceConnectedContract.matchOrder(orderId, price)
            toast({
                title: 'Success!',
                description: "You got NFT #"+tokenId+"!",
                status: 'success',
                duration: 4000,
                isClosable: true,
            })
            setTimeout(()=>{
                setIsLoading(false)
                window.location.reload();
            }, 5000)
        } catch(err) {
            console.log(err);
        } finally {
            setIsLoading(false)
        }
    }

    const getApproved = useCallback(async() => {
        if(!currentAccount) return;
        try {
            const { ethereum } = window; //injected by metamask
            //connect to an ethereum node
            const provider = new ethers.providers.Web3Provider(ethereum); 
            //gets the account
            const signer = provider.getSigner();
            //connects with the contract
            const CPTConnectedContract = new ethers.Contract(cpt_contract_address, cpt_abi, signer);
            let _bal = await CPTConnectedContract.allowance(currentAccount, "0xc60a6AE3a85838D3bAAf359219131B1e33103560");
            if(parseInt(_bal["_hex"],16) >= parseInt(price["_hex"], 16)) {
                setApproved(true)
            }
        } catch(err) {
            console.log(err)
        }
    }, [currentAccount, price])

    useEffect(() => {
        let isConnected = false;
        if(!isConnected) {
            getApproved();
        }
        return () => {
            isConnected = true;
        }
    }, [getApproved])

    return (
        <>
        <Button colorScheme='blue' onClick={() => setIsOpen(true)}>
            Buy
        </Button>

        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isCentered
        >
            <AlertDialogOverlay>
            <AlertDialogContent>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    <Progress hasStripe isAnimated value={approved ? 50 : 0} colorScheme='blue' my="4"
                    size="md" rounded="sm"
                    />
                    {approved ? 'Confirm Purchase' : 'Approve Purchase'}
                </AlertDialogHeader>

                <AlertDialogBody>
                {approved ? 'Buy' : 'Approve'} ID #{tokenId} for {parseInt(price["_hex"], 16)/ Math.pow(10, 18)} CPT
                </AlertDialogBody>

                <AlertDialogFooter>
                <Button isLoading={isLoading} colorScheme='blue' onClick={buyNFT} ml={3}>
                    {approved ? "Confirm" : "Approve"}
                </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
        </>
    )
}