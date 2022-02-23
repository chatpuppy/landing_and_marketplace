import React, { useState } from "react";
import { Box, Flex, Image, Badge, useColorModeValue, Button, Center, useToast, Heading } from "@chakra-ui/react";
import donateABI from "abi/TokensVesting_abi";
import { TOKEN_VESTING_ADDRESS } from "constants";


import { ethers } from "ethers";
import { useAuth } from "contexts/AuthContext";
import { useDonate } from "contexts/DonateContext";

const DonateModal = (props) => {
    const [ isLoading, setIsLoading ] = useState(false);
    const { currentAccount, currentNetwork } = useAuth()
    const toast = useToast()
    const id = 'toast'
    const {  participantID } = useDonate()

    const { amount } = props;


    const sendDonate = async() => {
        if((!window.ethereum) || (!currentAccount)){
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
    
        if(currentNetwork!==42) {
        if (!toast.isActive(id)) {
            toast({
            id,
            title: 'Wrong network',
            description: "Please change network to Kovan Testnet",
            status: 'error',
            duration: 4000,
            isClosable: true,
            })
        }
        return;
        }
        setIsLoading(true);

        try {
            const { ethereum } = window; //injected by metamask
            const provider = new ethers.providers.Web3Provider(ethereum); 
            const signer = provider.getSigner(); 
            const options = {value: ethers.utils.parseEther(amount)}
            const TokenVestingContract = new ethers.Contract(TOKEN_VESTING_ADDRESS, donateABI, signer);
            
            try {
                await TokenVestingContract.crowdFunding(participantID, options)
                toast({
                    title: 'Donate',
                    description: `Donate ${ethers.utils.formatEther(options.value)} ETH/BNB`,
                    status: 'sucess',
                    duration: 4000,
                    isClosable: true,
                })
                setTimeout(()=>{
                    window.location.reload();
                }, 5000)
            } catch(err) {
                console.error('call contract', err)
                setIsLoading(false);
            }
    
        } catch(err) {
            console.error('Error Donate Modal', err)
        }

    }

    

    

    return (
        <Flex
          bg={useColorModeValue("white", "gray.700")}
          w="full"
          alignItems="center"
          justifyContent="center"
        >
            <Heading>Donation {amount} ETH/BNB</Heading>
          <Box
            bg={useColorModeValue("white", "gray.700")}
            maxW="sm"
          >
            
            <Button
                fontFamily={'heading'}
                mb={2}
                w={'full'}
                bgGradient="linear(to-r, red.400,pink.400)"
                color={'white'}
                _hover={{
                    bgGradient: 'linear(to-r, red.400,pink.400)',
                    boxShadow: 'xl',
                }}
                _active={{
                    bgGradient: 'linear(to-r, red.200,pink.200)',
                    boxShadow: 'xl',
                }}
                onClick={sendDonate}
                isLoading={isLoading}
                >
                Donate
            </Button>
          </Box>
        </Flex>
    )
}

export default DonateModal;