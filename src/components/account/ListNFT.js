import React, { useState, useRef } from 'react'
import {
    Modal, ModalOverlay, ModalContent,
    ModalHeader, ModalBody, Select,
    ModalCloseButton, Button, useDisclosure, useToast, 
    FormControl, FormLabel, Input, Box
} from '@chakra-ui/react'
import { ethers } from "ethers";
import nft_core_abi from "abi/nft_core_abi.json"
import nft_marketplace_abi from "abi/nft_marketplace_abi.json"
import { useAuth } from 'contexts/AuthContext';
import { getNetworkConfig } from 'constants';
import ConfirmationProgress from '../ConfirmationProgress';

export default function ListNFT(props) {

    const { number, callback } = props;
    const toast = useToast();
    const [ isLoading, setIsLoading ] = useState(false);
    const [ hiddenConfirmationProgress, setHiddenConfirmationProgress] = useState(true);
    const [ confirmationProgressData, setConfirmationProgressData ] = useState({value: 5, message: 'Start', step: 1});
    const { currentAccount, approved, currentNetwork } = useAuth()
    const priceRef = useRef();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const networkConfig = getNetworkConfig(currentNetwork);
    const [ token, setToken ] = useState(networkConfig.paymentTokens[0].address);

    const NFT_core_contract_address = networkConfig.nftTokenAddress;
    const NFT_marketplace_contract_address = networkConfig.marketplaceAddress;
    
    const listNFT = async(e) => {
      e.preventDefault();
      setIsLoading(true);
      if(!currentAccount || !networkConfig) return;
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
            await tx.wait(networkConfig.confirmationNumbers);
            setConfirmationProgressData({step: '3/5', value: 60, message: 'Approved, start listing...'});
          } else {
            setTimeout(() => {
              setConfirmationProgressData({step: '3/5', value: 60, message: 'Allowance checked, start listing...'});
            }, 1500);
          }
          const tx = await NFTMarketplaceConnectedContract.addOrder(number, token, ethers.utils.parseEther(''+priceRef.current.value))
          setConfirmationProgressData({step: '4/5', value: 80, message: 'List NFT and wait confirmation...'});
          await tx.wait(networkConfig.confirmationNumbers);
          setConfirmationProgressData({step: '5/5', value: 100, message: 'You have got 2 confirmations, done!'})

          setTimeout(() => {
            callback(number);
          }, 2000);
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
              description: `${err.data !== undefined ? err.data.message : err.message}`,
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
      // console.log('payment token', e.target.value);
      setToken(e.target.value)
    }

		const onClickSell = () => {
			// console.log(networkConfig);
			if(networkConfig.buttons.sell.url !== null && networkConfig.buttons.sell.url.substr(0, 4) === 'http') {
				window.open(`${networkConfig.buttons.sell.url}${networkConfig.nftTokenAddress}/${number}/sell`);
			} else {
				onOpen();
			}
		}

    return (
      <>
				{networkConfig === undefined || !networkConfig.buttons.sell.visible ? <></> : 
        <Button 
          size="md" 
          mb={3} 
          mt={3}
          fontWeight="bold" 
          rounded="lg" 
          textTransform="uppercase"
          color={'gray.600'}
          bgGradient="linear(to-r, brand.500,brand.500)"
          _hover={{
            // bgGradient: 'linear(to-r, brand.150, brand.150)',
            boxShadow: 'xl',
          }}
          _active={{
            // bgGradient: 'linear(to-r, brand.200, brand.200)',
            boxShadow: 'xl',
          }}
          onClick={onClickSell}
          isLoading={isLoading}
        >
            {networkConfig.buttons.sell.label}
        </Button>
				}
        <Modal 
          isCentered
          isOpen={isOpen} 
          closeOnOverlayClick={false}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>List NFT</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
                <form onSubmit={listNFT}>
                    <FormControl id="token" isRequired>
                        <FormLabel>Token Name</FormLabel>
                        <Select isReadOnly onChange={handleTokenChange} placeholder={`Select payment token, Default ${networkConfig.paymentTokens[0].symbol}`}>
                          {networkConfig.paymentTokens.map((item, index) => 
                            <option key={index} value={item.address}>{item.symbol}</option>
                          )}
                        </Select>
                    </FormControl>
                    <FormControl id="price" isRequired my="2">
                        <FormLabel>Set Price</FormLabel>
                        <Input type="number" ref={priceRef} min="0" step="0.0001"/>
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