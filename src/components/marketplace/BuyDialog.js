import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
    AlertDialog, AlertDialogBody, AlertDialogFooter, ModalCloseButton,
    AlertDialogHeader, AlertDialogContent, AlertDialogOverlay,
    Button, useToast, Box
} from '@chakra-ui/react'
import cpt_abi from "abi/cpt_abi.json"
import nft_marketplace_abi from "abi/nft_marketplace_abi.json"
import { ethers } from "ethers";
import { useAuth } from 'contexts/AuthContext';
import {TOKEN_ADDRESS, MARKETPLACE_ADDRESS, TOKEN_SYMBOL} from 'constants';
import ConfirmationProgress from '../ConfirmationProgress';

export default function BuyDialog(props) {

    const cpt_contract_address = TOKEN_ADDRESS;
    const NFT_marketplace_contract_address = MARKETPLACE_ADDRESS;

    const { currentAccount } = useAuth()
    const toast = useToast();
    const { tokenId, price, orderId, callback } = props;
    const [ isLoading, setIsLoading ] = useState(false);
    const [isOpen, setIsOpen] = useState(false)
    const [ hiddenConfirmationProgress, setHiddenConfirmationProgress] = useState(true);
    const [ confirmationProgressData, setConfirmationProgressData ] = useState({value: 5, message: 'Start', step: 1});

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
            if(_bal < parseInt(price["_hex"], 16)) {
                toast({
                    title: 'Error!',
                    description: "Token balance is low!",
                    status: 'warning',
                    duration: 4000,
                    isClosable: true,
                })
                return;
            }
            setHiddenConfirmationProgress(false);
            setConfirmationProgressData({step: '1/5', value: 20, message: 'Start...'});
            try {
                if(!approved) {
                    const tx = await CPTConnectedContract.approve(NFT_marketplace_contract_address, price);
                    setConfirmationProgressData({step: '2/5', value: 40, message: 'Approving...'});
                    await tx.wait(2);
                    setConfirmationProgressData({step: '3/5', value: 60, message: 'Approved, start purchase...'});
                    setApproved(true);
                }
                const tx = await NFTMarketplaceConnectedContract.matchOrder(orderId, price);
                setConfirmationProgressData({step: '4/5', value: 80, message: 'Purchase NFT and wait confirmation...'});
                await tx.wait(2);
                setConfirmationProgressData({step: '5/5', value: 100, message: 'You have got 2 confirmations, done!'});

                callback(orderId);
            } catch (err) {
                if(err.code === 4001) {
                    toast({
                        title: 'Buy NFT order',
                        description: 'User cancel the transaction',
                        status: 'warning',
                        duration: 4000,
                        isClosable: true,
                    });
                    setHiddenConfirmationProgress(true);
                    setIsLoading(false);
                } else {
                    toast({
                        title: 'Buy NFT order',
                        description: `Error ${err.data.message}`,
                        status: 'error',
                        duration: 4000,
                        isClosable: true,
                    });
                    setIsLoading(false);
                }
            }
        } catch(err) {
            console.log(err);
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
            let _bal = await CPTConnectedContract.allowance(currentAccount, NFT_marketplace_contract_address);
            if(parseInt(_bal["_hex"],16) >= parseInt(price["_hex"], 16)) {
                setApproved(true)
            }
        } catch(err) {
            console.log(err)
        }
    }, [currentAccount, price, NFT_marketplace_contract_address, cpt_contract_address])

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
        <Box textAlign="right" w="full">
            <Button mt={-12} colorScheme='blue' onClick={() => setIsOpen(true)}>
                Buy
            </Button>
        </Box>

        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            closeOnOverlayClick={false}
            onClose={onClose}
            isCentered
        >
            <AlertDialogOverlay>
            <AlertDialogContent>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    {/* <Progress hasStripe isAnimated value={approved ? 50 : 0} colorScheme='blue' my="4"
                    size="md" rounded="sm"
                    /> */}
                    {approved ? 'Confirm' : 'Approve'}
                </AlertDialogHeader>
                <ModalCloseButton/>
                <AlertDialogBody>
                    {approved ? 'Buy' : 'Approve'} ChatPuppy NFT Token ID #{tokenId} with {parseInt(price["_hex"], 16)/ Math.pow(10, 18)} {TOKEN_SYMBOL}?
                    <Box h={5}></Box>
                    <ConfirmationProgress 
                        hidden={hiddenConfirmationProgress}
                        step={confirmationProgressData.step}
                        value={confirmationProgressData.value}
                        message={confirmationProgressData.message}
                    />
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