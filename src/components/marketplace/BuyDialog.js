import React, { useState, useRef } from 'react'
import {
    AlertDialog, AlertDialogBody, AlertDialogFooter,
    AlertDialogHeader, AlertDialogContent, AlertDialogOverlay,
    Button
} from '@chakra-ui/react'

export default function BuyDialog(props) {

    const { tokenId, price } = props;

    const [isOpen, setIsOpen] = useState(false)
    const onClose = () => setIsOpen(false)
    const cancelRef = useRef()

    const buyNFT = () => {
        
    }

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
                Confirm Purchase
                </AlertDialogHeader>

                <AlertDialogBody>
                    Buy ID #{tokenId} for {price} CPT
                </AlertDialogBody>

                <AlertDialogFooter>
                <Button colorScheme='blue' onClick={buyNFT} ml={3}>
                    Confirm
                </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
        </>
    )
}