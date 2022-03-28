import React, { useState, useEffect, useCallback } from 'react';
import Footer from 'components/Footer';
import NavBar from 'components/NavBar';
import { Tabs, TabList, Tab, TabPanels, TabPanel, SimpleGrid, useColorModeValue, useToast, Box, Select} from '@chakra-ui/react';
import { AiOutlineStar } from "react-icons/ai"
import { BsBoxSeam } from "react-icons/bs"
import OnSaleNFTs from 'components/marketplace/OnSaleNFTs';
import MyListedNFT from 'components/marketplace/MyListedNFTs'
import { ethers } from "ethers";
import nft_marketplace_abi from "abi/nft_marketplace_abi.json";
import nft_core_abi from "abi/nft_core_abi.json";
import { useAuth } from 'contexts/AuthContext';
// import PageName from 'components/PageName';
import EmptyList from 'components/EmptyList';
import { getNetworkConfig, API_BASE_URI } from 'constants';
import {skeleton} from '../components/common/LoadingSkeleton'
import AddressFooter from 'components/AddressFooter';
import {call} from '../services/db';

export default function Marketplace() {

  const color = useColorModeValue("black", "white")

  const [ isLoading, setIsLoading ] = useState(false);
  const _tabIndex = localStorage.getItem('marketplace_tab_index') === null ? 0 : localStorage.getItem('marketplace_tab_index') * 1;
  const [ tabIndex, setTabIndex ] = useState(_tabIndex);
  const { currentAccount, setListedNFTs, currentNetwork } = useAuth();
	const [ sortParams, setSortParams ] = useState("tokenId_1");
	const [ isLoadFromDB, setIsLoadFromDB ] = useState(true);
  const toast = useToast()
  const id = 'toast'
  
	const onOrderSelectChange = (e) => {
		setSortParams(e.target.value);
	}

	const orderSelect = 
	<Select isReadOnly onChange={onOrderSelectChange} placeholder={"Order by"} w={["100%", null, "30%"]} mt="5" mb="5">
		<option value={'tokenId_1'}>Sort by token id 9-0</option>
		<option value={'tokenId_0'}>Sort by token id 0-9</option>
		<option value={'startDate_1'}>Sort by create time 9-0</option>
		<option value={'startDate_0'}>Sort by create time 0-9</option>
		{/* <option value={'auctionId_1'}>Sort by order id 9-0</option>
		<option value={'auctionId_0'}>Sort by order id 0-9</option> */}
		<option value={'amount_1'}>Sort by price id 9-0</option>
		<option value={'amount_0'}>Sort by price id 0-9</option>
		<option value={'sellerAddress_1'}>Sort by seller address id 9-0</option>
		<option value={'sellerAddress_0'}>Sort by seller address id 0-9</option>
	</Select>

  const getListedNFTs = useCallback(async() => {
    setIsLoading(true);
    if(!currentAccount || !currentNetwork) return;
		console.log('Load data from chain...');

		setIsLoadFromDB(false);
    const networkConfig = getNetworkConfig(currentNetwork);
    const NFT_marketplace_contract_address = networkConfig.marketplaceAddress;
    const NFT_core_contract_address = networkConfig.nftTokenAddress;
  
    try {
        const { ethereum } = window; //injected by metamask
        //connect to an ethereum node
        const provider = new ethers.providers.Web3Provider(ethereum); 
        //gets the account
        const signer = provider.getSigner(); 
        //connects with the contract
        const NFTCoreConnectedContract = new ethers.Contract(NFT_core_contract_address, nft_core_abi, signer);
        const NFTMarketplaceConnectedContract = new ethers.Contract(NFT_marketplace_contract_address, nft_marketplace_abi, signer);
        let ordersArr = await NFTMarketplaceConnectedContract.onSaleOrders();
        ordersArr = ordersArr.map(x=>parseInt(x["_hex"], 16))
        let listedOrdersArr = [];

        for(let i=0; i<ordersArr.length; i++) {
            let _order = Object.assign([], await NFTMarketplaceConnectedContract.orders(ordersArr[i]));
            const _metadata = await NFTCoreConnectedContract.tokenMetaData(_order.tokenId);
            listedOrdersArr.push({
                orderId: ordersArr[i],
                deleted: false,
                ..._order,
                ..._metadata,
                ...{unboxed: _metadata._artifacts > 0},
            });
        }
        // console.log("orders", listedOrdersArr);
        setListedNFTs(listedOrdersArr);
    } catch(err) {
        console.log(err)
    } finally {
        setIsLoading(false)
    }
  }, [currentAccount, currentNetwork, setListedNFTs])

  const getListedNFTsFromDB = useCallback(async(page) => {
    setIsLoading(true);
    if(!currentNetwork) return;
    const networkConfig = getNetworkConfig(currentNetwork);
		const sortBy = sortParams.split('_');
		try {
			const response = await call(API_BASE_URI + 'getOnsaleOrders', {
				nftAddress: networkConfig.nftTokenAddress,
				limit: 12,
				offset: page * 12,
				order: sortBy[0],
				desc: parseInt(sortBy[1])
			});
			if(response.status !== 200) {
				console.log("#102 ERROR while loading data from database, try to load from blockchain...")
				getListedNFTs();
			}	
			// console.log('from db', response.data.data);
			if(!response.data.success && response.data.message === "no data") {
				console.log('No data');
				return;
			}
			let listedOrdersArr = [];
			for(let i = 0; i < response.data.data.length; i++) {
				const data = response.data.data[i];
				listedOrdersArr.push({
					orderId: data.auctionId,
					deleted: false,
					buyer: "0x0000000000000000000000000000000000000000",
					paymentToken: data.paymentToken,
					price: ethers.utils.parseEther(data.price),
					seller: data.sellerAddress,
					timestamp: ethers.BigNumber.from('' + data.time),
					tokenId: ethers.BigNumber.from(data.tokenId),
					unboxed: data.artifacts !== null,
					_artifacts: data.artifacts === null ? null : ethers.BigNumber.from(data.artifacts),
					_dna: data.dna,
					_hexArtifacts: data.artifacts === null ? null : ethers.BigNumber.from(data.artifacts).toHexString(),
				})
			}
			// console.log('listedOrdersArr', listedOrdersArr);
			setListedNFTs(listedOrdersArr);
			setIsLoading(false);
		} catch(err) {
			console.log("#101 ERROR while loading data from database, try to load from blockchain...")
			getListedNFTs();
		}
  }, [currentAccount, currentNetwork, setListedNFTs, sortParams]);

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
			// get from db is first choice, if fail, get from chain
			getListedNFTsFromDB(0);
    }
  
    return () => {
      isConnected = true;
    }
  }, [getListedNFTs, getListedNFTsFromDB, toast])
  
  const skeletons = (count) => {
    let arr = [];
    for(let i = 0; i < count; i++) {
        arr.push(skeleton(i));
    }
    return arr;
  }

  const handleTabsChange = (index) => {
    localStorage.setItem('marketplace_tab_index', index);
    setTabIndex(index);
  }

  return (
      <>
      <NavBar />
      {/* <PageName name="Marketplace" pic="./images/banner_marketplace.jpg"/> */}
      {
        currentAccount ? 
				<Box>
					{isLoadFromDB ? <Box w='80%' m="auto">{orderSelect}</Box> : <></>}
					<Tabs rounded="lg" m="auto" isLazy isFitted colorScheme="blue" defaultIndex={tabIndex} onChange={handleTabsChange}>
							<TabList mb='1em' m="auto" w={['90%', null, '80%']}>
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
									<TabPanel m='auto' w={['90%', null, '78%']}>
											<SimpleGrid columns={[1, 2, 4]} >
													{isLoading ? skeletons(8) : <OnSaleNFTs/>}
											</SimpleGrid>
									</TabPanel>
									<TabPanel m='auto' w={['90%', null, '78%']}>
											<SimpleGrid columns={[1, 2, 4]}>
													{isLoading ? skeletons(8) : <MyListedNFT/>}
											</SimpleGrid>
									</TabPanel>
							</TabPanels>
					</Tabs>
				</Box>
        :
				<Box>
					<Box w="80%" m="auto">{orderSelect}</Box>
					<Tabs rounded="lg" m="auto" isLazy isFitted colorScheme="blue" defaultIndex={tabIndex} onChange={handleTabsChange}>
							<TabList mb='1em' m="auto" w={['90%', null, '80%']}>
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
									<TabPanel m='auto' w={['90%', null, '78%']}>
											<SimpleGrid columns={[1, 2, 4]} >
													{isLoading ? skeletons(8) : <EmptyList />}
											</SimpleGrid>
									</TabPanel>
									<TabPanel m='auto' w={['90%', null, '78%']}>
											<SimpleGrid columns={[1, 2, 4]} >
													{isLoading ? skeletons(8) : <EmptyList />}
											</SimpleGrid>
									</TabPanel>
							</TabPanels>
					</Tabs>
				</Box>
      }
      <AddressFooter
        chainId={currentNetwork}
      />
      <Footer />
      </>
  );
}
