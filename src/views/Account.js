import React, { useState, useEffect, useCallback } from 'react';
import Footer from 'components/Footer';
import NavBar from 'components/NavBar';
import { useAuth } from 'contexts/AuthContext';
import { ethers } from "ethers";
import nft_core_abi from "abi/nft_core_abi.json"
import { SimpleGrid, useColorModeValue, useToast, Tabs, TabList, TabPanels, Tab, TabPanel, Box, Select } from '@chakra-ui/react';
import NFTCard from 'components/account/NFTCard';
// import PageName from 'components/PageName';
import BoxImageSrc from "assets/mysteryBox.jpg"
import { AiOutlineStar } from "react-icons/ai"
import { BsBoxSeam } from "react-icons/bs"
import EmptyList from 'components/EmptyList';
import {getNetworkConfig, API_BASE_URI} from 'constants';
import {skeleton} from '../components/common/LoadingSkeleton'
import AddressFooter from 'components/AddressFooter';
import {call} from '../services/db';
import {Pagination} from '../utils/Pagination';

export default function Account() {

    const [ isLoading, setIsLoading ] = useState(false);
    const { currentAccount, setOwnedNFTs, setApproved, currentNetwork } = useAuth();
    const [ boxedItems, setBoxedItems ] = useState([]);
    const [ unboxedItems, setUnboxedItems ] = useState([]);
    const _tabIndex = localStorage.getItem('account_tab_index') === null ? 0 : localStorage.getItem('account_tab_index') * 1;
    const [ tabIndex, setTabIndex ] = useState(_tabIndex);
		const [ sortParams, setSortParams ] = useState("--n.tokenId_1");
		const [ isLoadFromDB, setIsLoadFromDB ] = useState(true);
		const [ totalNFTs, setTotalNFTs ] = useState({count: 0, boxedCount: 0, unboxedCount: 0});
		const [ currentPage, setCurrentPage ] = useState(0);
		const [ pageSize, setPageSize ] = useState(12);
			const toast = useToast();
    const id = 'toast'

    let _boxedItems = [];
    let _unboxedItems = [];

		const onOrderSelectChange = (e) => {
			if(e.target.value !== "") setSortParams(e.target.value);
		}

		const orderSelect = 
		<Select isReadOnly onChange={onOrderSelectChange} placeholder={"Sort by"} w={["100%", null, "30%"]} mt="5" mb="5">
			<option value={'--n.tokenId_1'}>Sort by token id 9-0</option>
			<option value={'--n.tokenId_0'}>Sort by token id 0-9</option>
			<option value={'--n.exp_1'}>Sort by experience 9-0</option> 		
			<option value={'--n.exp_0'}>Sort by experience 0-9</option>	
			<option value={'--n.level_1'}>Sort by level 9-0</option>
			<option value={'--n.level_0'}>Sort by level 0-9</option>
		</Select>

    const getOwnedTokens = useCallback(async() => {
        setIsLoading(true);
        if(!currentAccount || !currentNetwork) return;
				console.log('Load data from chain...')
				setIsLoadFromDB(false);
        const networkConfig = getNetworkConfig(currentNetwork);
        const NFT_core_contract_address = networkConfig.nftTokenAddress;
        // eslint-disable-next-line react-hooks/exhaustive-deps
        _boxedItems = [];
        // eslint-disable-next-line react-hooks/exhaustive-deps
        _unboxedItems = [];
        try {
					const { ethereum } = window; //injected by metamask
					//connect to an ethereum node
					const provider = new ethers.providers.Web3Provider(ethereum); 
					//gets the account
					const signer = provider.getSigner(); 
					//connects with the contract
					const NFTCoreConnectedContract = new ethers.Contract(NFT_core_contract_address, nft_core_abi, signer);
					// const NFTManagerConnectedContract = new ethers.Contract(NFT_manager_contract_address, nft_manager_v2_abi, signer);
					let count = await NFTCoreConnectedContract.balanceOf(currentAccount);
					let _approved = await NFTCoreConnectedContract.isApprovedForAll(currentAccount, networkConfig.marketplaceAddress);
					setApproved(_approved);
					count = parseInt(count["_hex"], 16);
					let _ownedNFTs = []
					for(let i = 0; i < count; i++) {
							let _id = await NFTCoreConnectedContract.tokenOfOwnerByIndex(currentAccount, i);
							_id = parseInt(_id["_hex"], 16);
							const _metadata = await NFTCoreConnectedContract.tokenMetaData(_id);
							const _uri = await NFTCoreConnectedContract.tokenURI(_id);
							_ownedNFTs.push([_id, _metadata._artifacts > 0 ? 1 : 0]);
							const data = {
									id: _id, 
									uri: _uri,
									metadata: _metadata._artifacts, 
									dna: _metadata._dna,
									deleted: false
							};
							if(_metadata._artifacts > 0) _unboxedItems.push(data);
							else _boxedItems.push(data);
					}
					// console.log('from chain', _unboxedItems, _boxedItems);
					// console.log('from chain', _ownedNFTs);
					setOwnedNFTs(_ownedNFTs);
					parseBoxes(_boxedItems, _unboxedItems);
        } catch(err) {
					console.log(err)
        } finally {
					setTimeout(() => {
						setIsLoading(false)
					}, 400);
        }
    }, [currentAccount, setApproved, setOwnedNFTs, currentNetwork])
    
		const getTotalNFTs = async (nftAddress, address) => {
			const _total = await call(API_BASE_URI + 'userNFTCount', {
				nftAddress,
				address
			});
			if(_total.status !== 200 || !_total.data.success) return false;
			return _total.data.data;
		}
	
		const getOwnedTokenFromDB = useCallback(async () => {
			setIsLoading(true);
			if(!currentAccount || !currentNetwork) return;
			const networkConfig = getNetworkConfig(currentNetwork);
			const sortBy = sortParams.split('_');
			try {
				const _total = await getTotalNFTs(networkConfig.nftTokenAddress, currentAccount);
				if(!_total || _total === 0) {console.log('No data'); return;}
				// console.log('total nfts', _total);
				setTotalNFTs(_total);

				const response = await call(API_BASE_URI + 'getUserNFTs', {
					nftAddress: networkConfig.nftTokenAddress,
					address: currentAccount,
					limit: pageSize,
					offset: currentPage * pageSize,
					order: sortBy[0],
					desc: parseInt(sortBy[1]),
				});

				if(response.status !== 200) { 
					console.log("ERROR while loading data from database, try to load from blockchain...")
					getOwnedTokens();
				}
				// console.log('my nfts', response.data.data);
				if(!response.data.success && response.data.message === "no data") {
					console.log('No data');
					return;
				}
				let _ownedNFTs = [];
				for(let i = 0; i < response.data.data.length; i++) {
					const d = response.data.data[i];
					const data = {
						id: parseInt(d.tokenId),
						deleted: false,
						dna: d.dna === null ? "0x0000000000000000000000000000000000000000000000000000000000000000" : d.dna,
						metadata: d.artifacts === null ? ethers.BigNumber.from('0') : ethers.BigNumber.from(d.artifacts),
						uri: d.tokenURI === null ? '' : d.tokenURI,
					}
					_ownedNFTs.push([parseInt(d.tokenId), d.artifacts === null ? 0 : 1]);
					if(d.artifacts === null) _boxedItems.push(data);
					else _unboxedItems.push(data);
				}
				// console.log("from db", _unboxedItems, _boxedItems);
				// console.log('from db', _ownedNFTs)
				setOwnedNFTs(_ownedNFTs);
				parseBoxes(_boxedItems, _unboxedItems);
			} catch (err) {
				console.error(err);
				console.log("ERROR while loading data from database, try to load from blockchain...")
				getOwnedTokens();
			} finally {
				setTimeout(() => {
					setIsLoading(false);
				}, 400);
			}
		}, [currentAccount, setApproved, setOwnedNFTs, currentNetwork, currentPage, pageSize, sortParams]);

    const parseBoxes = (_boxedItems, _unboxedItems) => {
        if(_boxedItems.length > 0) {
            let arr = [];
            try{
                // eslint-disable-next-line array-callback-return
                _boxedItems.map((data, index) => {
                if(_boxedItems[index].deleted) arr.push(skeleton(index));
                else arr.push(<NFTCard 
                    key={_boxedItems[index].id * 1} 
                    number={_boxedItems[index].id} 
                    unboxed={false}
                    metadata={_boxedItems[index].metadata}
                    dna={_boxedItems[index].dna}
                    src={BoxImageSrc}
                    uri={''}
                    callback={(tokenId, type) => deleteFromBoxedItems(tokenId, type)}
                />)
                })
                setBoxedItems(arr);
            } catch(e){
                console.log(e);
            }
        } else {
					setBoxedItems(<EmptyList/>);
        }
        if(_unboxedItems.length > 0) {
            let arr = [];
            try {
                // eslint-disable-next-line array-callback-return
                _unboxedItems.map((data, index) => {
                if(_unboxedItems[index].deleted) arr.push(skeleton(index));
                else arr.push(<NFTCard 
                    key={_unboxedItems[index].id * 1} 
                    number={_unboxedItems[index].id} 
                    unboxed={true}
                    metadata={_unboxedItems[index].metadata}
                    dna={_unboxedItems[index].dna}
                    src={null}
                    uri={_unboxedItems[index].uri}
                    callback={(tokenId, type) => deleteFromUnboxedItems(tokenId, type)}
                />)}
                )
                setUnboxedItems(arr);    
            } catch(e) {
                console.log(e);
            }
        } else {
					setUnboxedItems(<EmptyList/>);
        }
    }

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
            if(!currentNetwork) return;
						// get from db is first choice, if fail, get from chain
            getOwnedTokenFromDB(); 
        }

        return () => {
            isConnected = true;
        };
    }, [getOwnedTokens, getOwnedTokenFromDB, currentNetwork, toast]);
    
    const color = useColorModeValue("black", "white");

    const skeletons = (count) => {
        let arr = [];
        for(let i = 0; i < count; i++) {
            arr.push(skeleton(i));
        }
        return arr;
    }

    const handleTabsChange = (index) => {
        localStorage.setItem('account_tab_index', index);
        setTabIndex(index);
    }

    const deleteFromBoxedItems = (key, type) => {
        // console.log('deleteFromBoxedItems', _boxedItems)
        if(type === 1) return; 
        let deletedKey = 0;
        for(let i = 0; i < _boxedItems.length; i++) {
            const item = _boxedItems[i];
            if(parseInt(item.id) === parseInt(key)) {
                item.deleted = true;
                deletedKey = i;
                break;
            }
        }
        parseBoxes(_boxedItems, _unboxedItems);
        setTimeout(() => {
            _boxedItems.splice(deletedKey, 1);
            parseBoxes(_boxedItems, _unboxedItems);
        }, 3000);
    }

    const deleteFromUnboxedItems = (key, type) => {
        // console.log('deleteFromUnboxedItems', _unboxedItems);
        if(type === 1) return;
        let deletedKey = 0;
        for(let i = 0; i < _unboxedItems.length; i++) {
            const item = _unboxedItems[i];
            if(parseInt(item.id) === parseInt(key)) {
                item.deleted = true;
                deletedKey = i;
                break;
            }
        }
        parseBoxes(_boxedItems, _unboxedItems);
        setTimeout(() => {
            _unboxedItems.splice(deletedKey, 1);
            parseBoxes(_boxedItems, _unboxedItems);
        }, 3000);
    }

    return (
        <>
        <NavBar />
        {/* <PageName name="My NFTs" pic="./images/banner_list.jpg" /> */}
        {
        currentAccount ?
				<Box>
					{isLoadFromDB ? <Box w='80%' m="auto">{orderSelect}</Box> : <></>}
					<Tabs rounded="lg" m="auto" isLazy isFitted colorScheme="blue" defaultIndex={tabIndex} onChange={handleTabsChange}>
							<TabList mb='1em' m="auto" w={['90', null, '80%']}>
									<Tab _focus={{outline: "none"}} color={color}>
											<BsBoxSeam pr="2"/>
											<span style={{marginLeft: "10px"}}>Mystery Boxes</span>
											
									</Tab>
									<Tab _focus={{outline: "none"}} color={color}>
											<AiOutlineStar />
											<span style={{marginLeft: "10px"}}>NFTs</span>
									</Tab>
							</TabList>
							<TabPanels>
									<TabPanel m='auto' w={['90%', null, '78%']}>
											<SimpleGrid columns={[1, 2, 4]}>
													{isLoading ? skeletons(pageSize) : boxedItems.length===0 ? <EmptyList /> : boxedItems}
											</SimpleGrid>
									</TabPanel>
									<TabPanel m='auto' w={['90%', null, '78%']}>
											<SimpleGrid columns={[1, 2, 4]}>
													{isLoading ? skeletons(pageSize) : unboxedItems.length===0 ? <EmptyList /> : unboxedItems}
											</SimpleGrid>
									</TabPanel>
							</TabPanels>
					</Tabs>
				</Box>
        :
				<Box>
					<Box w='80%' m="auto">{orderSelect}</Box>
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
						pageCount={parseInt(((tabIndex === 0 ? totalNFTs.boxedCount : totalNFTs.unboxedCount) - 1) / pageSize) + 1}
						totalRecords={tabIndex === 0 ? totalNFTs.boxedCount : totalNFTs.unboxedCount}
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
