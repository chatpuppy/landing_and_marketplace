import React, { useState, useEffect, useCallback } from 'react';
import Footer from 'components/Footer';
import NavBar from 'components/NavBar';
import { Tabs, TabList, Tab, TabPanels, TabPanel, SimpleGrid, useColorModeValue, Button, useToast, Box, Select} from '@chakra-ui/react';
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
import {Pagination} from '../utils/Pagination';

export default function Marketplace() {

  const color = useColorModeValue("black", "white")

  const [ isLoading, setIsLoading ] = useState(false);
  const _tabIndex = localStorage.getItem('marketplace_tab_index') === null ? 0 : localStorage.getItem('marketplace_tab_index') * 1;
  const [ tabIndex, setTabIndex ] = useState(_tabIndex);
  const { currentAccount, listedNFTs, setListedNFTs, currentNetwork } = useAuth();
	const [ sortParams, setSortParams ] = useState("tokenId_1");
	const [ isLoadFromDB, setIsLoadFromDB ] = useState(true);
	const [ totalOnsale, setTotalOnsale ] = useState({total: 0, onsaleCount: 0, myListedCount: 0});
	const [ currentPage, setCurrentPage ] = useState(0);
	const [ pageSize, setPageSize ] = useState(12);
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
		{/* <option value={'unboxed'}>Only Unboxed NFTs</option>
		<option value={'boxed'}>Only Mystery box NFTs</option> */}
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

	const getOnsaleCount = async (nftAddress) => {
		const _totalOnsale = await call(API_BASE_URI + 'onsaleCount', {nftAddress, address: currentAccount});
		if(_totalOnsale.status !== 200 || !_totalOnsale.data.success) return false;
		return _totalOnsale.data.data;
	}

  const getListedNFTsFromDB = useCallback(async() => {
    setIsLoading(true);
    if(!currentNetwork) return;
    const networkConfig = getNetworkConfig(currentNetwork);
		const sortBy = sortParams.split('_');
		// console.log('currentPage', currentPage)
		try {
			const _totalOnsale = await getOnsaleCount(networkConfig.nftTokenAddress);
			if(!_totalOnsale || _totalOnsale === 0) {console.log('No data'); return;}
			setTotalOnsale(_totalOnsale);

			const response = await call(API_BASE_URI + 'getOnsaleOrders', {
				nftAddress: networkConfig.nftTokenAddress,
				address: currentAccount,
				limit: pageSize,
				offset: currentPage * pageSize,
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
			// console.log('=1=', listedOrdersArr);
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
			// console.log('=2=', listedOrdersArr);
			setListedNFTs(listedOrdersArr);
			setIsLoading(false);
		} catch(err) {
			console.log("#101 ERROR while loading data from database, try to load from blockchain...")
			getListedNFTs();
		}
  }, [currentAccount, currentNetwork, setListedNFTs, sortParams, currentPage, pageSize]);

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
			getListedNFTsFromDB();
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

	const itemList = (type) => {
		return type === 0 ? 
		<OnSaleNFTs/>
		: 
		<MyListedNFT/>
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
													{isLoading ? skeletons(pageSize) : itemList(0)}
											</SimpleGrid>
									</TabPanel>
									<TabPanel m='auto' w={['90%', null, '78%']}>
											<SimpleGrid columns={[1, 2, 4]}>
													{isLoading ? skeletons(pageSize) : itemList(1)}
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
													{isLoading ? skeletons(pageSize) : <EmptyList />}
											</SimpleGrid>
									</TabPanel>
									<TabPanel m='auto' w={['90%', null, '78%']}>
											<SimpleGrid columns={[1, 2, 4]} >
													{isLoading ? skeletons(pageSize) : <EmptyList />}
											</SimpleGrid>
									</TabPanel>
							</TabPanels>
					</Tabs>
				</Box>
      }
			<Box m="auto" w={['40%', null, '60%']} mb="10">
				<Pagination
					canPreviousPage={true}
					canNextPage={true}
					pageCount={parseInt(((tabIndex === 0 ? totalOnsale.onsaleCount : totalOnsale.myListedCount) - 1) / pageSize) + 1}
					totalRecords={tabIndex === 0 ? totalOnsale.onsaleCount : totalOnsale.myListedCount}
					changePageTo={(page) => setCurrentPage(page)}
					changePageSize={(size) => {setCurrentPage(0); setPageSize(size)}}
				/>
			</Box>
      <AddressFooter
        chainId={currentNetwork}
      />
      <Footer />
      </>
  );
}
