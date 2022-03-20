import React, { useState, useEffect, useCallback } from 'react';
import Footer from 'components/Footer';
import NavBar from 'components/NavBar';
import { Tabs, TabList, Tab, TabPanels, TabPanel, SimpleGrid,
  useColorModeValue, useToast, Stack, SkeletonCircle, SkeletonText, Box, Flex
} from '@chakra-ui/react';
import { AiOutlineStar } from "react-icons/ai"
import { BsBoxSeam } from "react-icons/bs"
import OnSaleNFTs from 'components/marketplace/OnSaleNFTs';
import MyListedNFT from 'components/marketplace/MyListedNFTs'
import { ethers } from "ethers";
import nft_marketplace_abi from "abi/nft_marketplace_abi.json";
import nft_core_abi from "abi/nft_core_abi.json";
import { useAuth } from 'contexts/AuthContext';
// import FAQ from 'components/FAQ';
import PageName from 'components/PageName';
import EmptyList from 'components/EmptyList';
import { MARKETPLACE_ADDRESS, NFT_TOKEN_ADDRESS } from 'constants';

export default function Marketplace() {

  const color = useColorModeValue("black", "white")
  const NFT_marketplace_contract_address = MARKETPLACE_ADDRESS;
  const NFT_core_contract_address = NFT_TOKEN_ADDRESS

  const [ isLoading, setIsLoading ] = useState(false);
  const { currentAccount, setListedNFTs } = useAuth()
  const toast = useToast()
  const id = 'toast'
  
  const getListedNFTs = useCallback(async() => {
    setIsLoading(true);
    if(!currentAccount) return;
    try {
        const { ethereum } = window; //injected by metamask
        //connect to an ethereum node
        const provider = new ethers.providers.Web3Provider(ethereum); 
        //gets the account
        const signer = provider.getSigner(); 
        //connects with the contract
        const NFTCoreConnectedContract = new ethers.Contract(NFT_core_contract_address, nft_core_abi, signer);
        const NFTMarketplaceConnectedContract = new ethers.Contract(NFT_marketplace_contract_address, nft_marketplace_abi, signer);
        let ordersArr = await NFTMarketplaceConnectedContract.onSaleOrders();// ######
        ordersArr = ordersArr.map(x=>parseInt(x["_hex"], 16))
        let listedOrdersArr = [];

        for(let i=0; i<ordersArr.length; i++) {
            let _order = Object.assign([], await NFTMarketplaceConnectedContract.orders(ordersArr[i]));
            const _metadata = await NFTCoreConnectedContract.tokenMetaData(_order.tokenId);
            listedOrdersArr.push({
                orderId: ordersArr[i],
                ..._order,
                ..._metadata,
                ...{unboxed: _metadata._artifacts > 0},
            });
        }
        // console.log('===', listedOrdersArr);
        setListedNFTs(listedOrdersArr);
    } catch(err) {
        console.log(err)
    } finally {
        setIsLoading(false)
    }
  }, [currentAccount, NFT_core_contract_address, NFT_marketplace_contract_address, setListedNFTs])


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
  
  const skeleton = <Flex w="full" p={5} ml={10} mr={10}>
      <Box w="md" pl={10} pr={10} pt={20} pd={20} h="md" maxW="md" max="auto" shadow="lg" rounded="lg" bg={useColorModeValue("gray.50", "gray.700")}>
      <SkeletonCircle size="100"/><SkeletonText mt='6' noOfLines={4} spacing='4'/>
      </Box>
      </Flex>;

  const skeletons = (count) => {
    let arr = [];
    for(let i = 0; i < count; i++) {
        arr.push(skeleton);
    }
    return arr;
  }

  return (
      <>
      <NavBar />
      {/* <PageName name="Marketplace" pic="./images/banner_marketplace.jpg"/> */}
      {
        currentAccount ?
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
                <TabPanel m='auto' w='80%'>
                    <SimpleGrid columns={[1, null, 4]} >
                        {isLoading ? skeletons(8) : <OnSaleNFTs/>}
                    </SimpleGrid>
                </TabPanel>
                <TabPanel m='auto' w='80%'>
                    <SimpleGrid columns={[1, null, 4]}>
                        {isLoading ? skeletons(8) : <MyListedNFT/>}
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
                <TabPanel m='auto' w='80%'>
                    <SimpleGrid columns={[1, null, 4]} >
                        {isLoading ? skeletons() : <EmptyList />}
                    </SimpleGrid>
                </TabPanel>
                <TabPanel m='auto' w='80%'>
                    <SimpleGrid columns={[1, null, 4]} >
                        {isLoading ? skeletons() : <EmptyList />}
                    </SimpleGrid>
                </TabPanel>
            </TabPanels>
        </Tabs>
      }
      {/* <FAQ /> */}
      <Footer />
      </>
  );
}
