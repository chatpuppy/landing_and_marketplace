import React, { useState, useEffect, useCallback } from 'react';
import Footer from 'components/Footer';
import NavBar from 'components/NavBar';
import { Tabs, TabList, Tab, TabPanels, TabPanel, SimpleGrid,
  useColorModeValue, useToast, Stack, Skeleton
} from '@chakra-ui/react';
import { AiOutlineStar } from "react-icons/ai"
import { BsBoxSeam } from "react-icons/bs"
import OnSaleNFTs from 'components/marketplace/OnSaleNFTs';
import MyListedNFT from 'components/marketplace/MyListedNFTs'
import { ethers } from "ethers";
import nft_marketplace_abi from "abi/nft_marketplace_abi.json"
import { useAuth } from 'contexts/AuthContext';
import FAQ from 'components/FAQ';
import PageName from 'components/PageName';
import EmptyList from 'components/EmptyList';

export default function Marketplace() {

  const color = useColorModeValue("black", "white")
  const NFT_marketplace_contract_address = "0xc60a6AE3a85838D3bAAf359219131B1e33103560"
  const [ isLoading, setIsLoading ] = useState(false);
  const { currentAccount, setListedNFTs } = useAuth()
  const toast = useToast()
  const id = 'toast'
  
  const getListedNFTs = useCallback(async() => {
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
        let ordersArr = await NFTMarketplaceConnectedContract.onSaleOrders()
        ordersArr = ordersArr.map(x=>parseInt(x["_hex"], 16))
        let listedOrdersArr = [];
        for(let i=0; i<ordersArr.length; i++) {
            let _order = Object.assign([], await NFTMarketplaceConnectedContract.orders(ordersArr[i]))
            _order.push(ordersArr[i])
            listedOrdersArr.push(_order);
        }
        setListedNFTs(listedOrdersArr)
    } catch(err) {
        console.log(err)
    } finally {
        setIsLoading(false)
    }
  }, [currentAccount, setListedNFTs])


  useEffect(() => {
    let isConnected = false;
    if(!isConnected) {
      if(!window.ethereum) {
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
      getListedNFTs()
    }
  
    return () => {
      isConnected = true;
    }
  }, [getListedNFTs, toast])
  

  return (
      <>
      <NavBar />
      <PageName name="Marketplace" />
      {
        currentAccount ?
        isLoading 
        ? 
        <Stack >
            <Skeleton bg="gray.400" height='20px' />
            <Skeleton bg="gray.400" height='60vh' />
            <Skeleton bg="gray.400" height='20px' />
        </Stack>
        : 
        <Tabs rounded="lg" m="auto" isLazy isFitted colorScheme="blue" defaultIndex={0}>
            <TabList mb='1em' m="auto" w="80%">
                <Tab _focus={{outline: "none"}} color={color}>
                    <BsBoxSeam pr="2"/>
                    <span style={{marginLeft: "10px"}}>On Sale NFTs</span> 
                </Tab>
                <Tab _focus={{outline: "none"}} color={color}>
                    <AiOutlineStar />
                    <span style={{marginLeft: "10px"}}>My Listed NFTs</span>
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <SimpleGrid columns={[1, null, 3]} >
                        <OnSaleNFTs />
                    </SimpleGrid>
                </TabPanel>
                <TabPanel>
                    <SimpleGrid columns={[1, null, 3]}>
                        <MyListedNFT />
                    </SimpleGrid>
                </TabPanel>
            </TabPanels>
        </Tabs>
        :
        <Tabs rounded="lg" m="auto" isLazy isFitted colorScheme="blue" defaultIndex={1}>
            <TabList mb='1em' m="auto" w="80%">
                <Tab _focus={{outline: "none"}} color={color}>
                    <BsBoxSeam pr="2"/>
                    <span style={{marginLeft: "10px"}}>Mystery Box</span>
                    
                </Tab>
                <Tab _focus={{outline: "none"}} color={color}>
                    <AiOutlineStar />
                    <span style={{marginLeft: "10px"}}>NFTs</span>
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <SimpleGrid columns={[1, null, 3]} >
                        <EmptyList />
                    </SimpleGrid>
                </TabPanel>
                <TabPanel>
                    <SimpleGrid columns={[1, null, 3]} >
                        <EmptyList />
                    </SimpleGrid>
                </TabPanel>
            </TabPanels>
        </Tabs>
      }
      <FAQ />
      <Footer />
      </>
  );
}
