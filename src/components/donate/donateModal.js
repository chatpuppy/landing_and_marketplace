import React, { useState } from "react";
import { Box, Flex, Image, Text, Badge, useColorModeValue, Button, Center, useToast, Heading, Stat, StatLabel, StatHelpText, StatNumber } from "@chakra-ui/react";
import donateABI from "abi/TokensVesting_abi";
import { TOKEN_VESTING_ADDRESS } from "constants";


import { ethers } from "ethers";
import { useAuth } from "contexts/AuthContext";
import { useDonate } from "contexts/DonateContext";

import { useContractWrite } from 'wagmi'
import { Card } from "../common/Card"

const DonateModal = (props) => {
    const [ isLoading, setIsLoading ] = useState(false);
    const { currentAccount, currentNetwork } = useAuth()
    const toast = useToast()
    const id = 'toast'
    const {  participantID } = useDonate()

    const { amount } = props;

    


    const sendDonate = async() => {
        if (!currentAccount && !currentNetwork === 42) return 0
        setIsLoading(true);
        try {
          
            const { ethereum } = window; //injected by metamask
            const provider = new ethers.providers.Web3Provider(ethereum); 
            const signer = provider.getSigner(); 
            const options = {value: ethers.utils.parseEther((amount).toString())}
            const TokenVestingContract = new ethers.Contract(TOKEN_VESTING_ADDRESS, donateABI, signer);
            
            let uint8 = new Uint8Array(2);
            uint8[0] = participantID;

            try {
                await TokenVestingContract.crowdFunding(uint8[0], options)
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
                console.log(err)
                setIsLoading(false);
            }
    
        } catch(err) {
            console.log('Error Donate Modal', err)
        }

    }

    

    

    return (
        <Flex
          bg={useColorModeValue("white", "gray.700")}
          w="full"
          alignItems="center"
          justifyContent="center"
          direction={"column"}
        >
            
          <Box
            bg={useColorModeValue("white", "gray.700")}
            maxW="sm"
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Stat>
                <StatLabel>Vesting Donation</StatLabel>
                <StatNumber>{amount}</StatNumber>
                <StatHelpText>BNB/ETH</StatHelpText>
            </Stat>
            
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