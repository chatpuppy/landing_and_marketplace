import React, { useState } from "react";
import { 
    Box, 
    Flex, 
    useColorModeValue, 
    Button, 
    useToast, 
    Stat, 
    StatLabel, 
    StatHelpText, 
    StatNumber 
} from "@chakra-ui/react";
import donateABI from "abi/TokensVesting_abi";
import { TOKEN_VESTING_ADDRESS, getNetworkConfig } from "constants";
import ConfirmationProgress from '../ConfirmationProgress';
import { ethers } from "ethers";
import { useAuth } from "contexts/AuthContext";
import { useDonate } from "contexts/DonateContext";

const DonateModal = (props) => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isDonated, setIsDonated ] = useState(false);
    const [ hiddenConfirmationProgress, setHiddenConfirmationProgress] = useState(true);
    const [ confirmationProgressData, setConfirmationProgressData ] = useState({value: 5, message: 'Start', step: 1});
    const { currentAccount, currentNetwork } = useAuth()
    const toast = useToast()
    const { participantID } = useDonate()
    const { amount } = props;

    const sendDonate = async() => {
        if (!currentAccount || !currentNetwork) return;
				const networkConfig = getNetworkConfig(currentNetwork);
				console.log('network config 3: ' + networkConfig);
	
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
							setHiddenConfirmationProgress(false);
							setConfirmationProgressData({step: '1/3', value: 20, message: 'Start...'});
							const tx = await TokenVestingContract.crowdFunding(uint8[0], options);
                toast({
                    title: 'Donate',
                    description: `Waiting for confirmation, hash: ${tx.hash}`,
                    status: 'warning',
                    duration: 4000,
                    isClosable: true,
                });

								setConfirmationProgressData({step: '2/3', value: 50, message: 'Waiting for confirmation...'});
                await tx.wait(networkConfig.confirmationNumbers);
								setConfirmationProgressData({step: '2/3', value: 50, message: 'Transaction is confirmed...'});
								setTimeout(() => {
									toast({
                    title: 'Donate',
                    description: `Congrat! you have donated successfully, refresh the page and check the result.`,
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
	                })
									setHiddenConfirmationProgress(true);
									setIsLoading(false);
									setIsDonated(true);	
								}, 2000);
            } catch(err) {
                toast({
                    title: 'Donate error',
                    description: `${err.data.message}`,
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                })
                setIsLoading(false);
            }
    
        } catch(err) {
            console.log('Error Donate Modal', err)
            setIsLoading(false);
        }

    }

    return (
        <Box
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
                <StatHelpText>BNB</StatHelpText>
            </Stat>
            
            <Button
                fontFamily={'heading'}
                mb={2}
                w={'full'}
                bgGradient="linear(to-r, red.400,pink.400)"
                color={'white'}
                // _hover={{
                //     bgGradient: 'linear(to-r, red.400,pink.400)',
                //     boxShadow: 'xl',
                // }}
                // _active={{
                //     bgGradient: 'linear(to-r, red.200,pink.200)',
                //     boxShadow: 'xl',
                // }}
                onClick={sendDonate}
                isLoading={isLoading}
                isDisabled={isDonated}
                >
                Donate
            </Button>
            
            
          </Box>
					<ConfirmationProgress 
						hidden={hiddenConfirmationProgress}
						step={confirmationProgressData.step}
						value={confirmationProgressData.value}
						message={confirmationProgressData.message}
					/>
        </Box>
    )
}

export default DonateModal;