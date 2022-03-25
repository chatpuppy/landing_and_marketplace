import React, { useState, useEffect, useCallback } from 'react';
import Footer from 'components/Footer';
import NavBar from 'components/NavBar';
import { useAuth } from 'contexts/AuthContext';
import { ethers } from "ethers";
import nft_core_abi from "abi/nft_core_abi.json"
import { SimpleGrid, useColorModeValue, useToast, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import NFTCard from 'components/account/NFTCard';
// import PageName from 'components/PageName';
import BoxImageSrc from "assets/mysteryBox.jpg"
import { AiOutlineStar } from "react-icons/ai"
import { BsBoxSeam } from "react-icons/bs"
import EmptyList from 'components/EmptyList';
import {getNetworkConfig} from 'constants';
import {skeleton} from '../components/common/LoadingSkeleton'
import AddressFooter from 'components/AddressFooter';

export default function Account() {

    const [ isLoading, setIsLoading ] = useState(false);
    const { currentAccount, setOwnedNFTs, setApproved, currentNetwork } = useAuth();
    const [ boxedItems, setBoxedItems ] = useState([]);
    const [ unboxedItems, setUnboxedItems ] = useState([]);
    const _tabIndex = localStorage.getItem('account_tab_index') === null ? 0 : localStorage.getItem('account_tab_index') * 1;
    const [ tabIndex, setTabIndex ] = useState(_tabIndex);
    const toast = useToast();
    const id = 'toast'

    let _boxedItems = [];
    let _unboxedItems = [];

    const getOwnedTokens = useCallback(async() => {
        setIsLoading(true);
        if(!currentAccount || !currentNetwork) return;
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
            for(let i=0; i<count; i++) {
                let _id = await NFTCoreConnectedContract.tokenOfOwnerByIndex(currentAccount, i);
                _id = parseInt(_id["_hex"], 16);
                // const _type = await NFTManagerConnectedContract.boxStatus(_id); // 需要用另外方法判断是否unboxed，否则在NFTManager升级后，数据会丢失
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
    
    const parseBoxes = (_boxedItems, _unboxedItems) => {
        if(_boxedItems.length !== 0 && boxedItems.length === 0) {
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
        if(_unboxedItems.length !== 0 && unboxedItems.length === 0) {
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
            getOwnedTokens();
        }

        return () => {
            isConnected = true;
        };
    }, [getOwnedTokens, currentNetwork, toast]);
    
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
                        {isLoading ? skeletons(8) : boxedItems.length===0 ? <EmptyList /> : boxedItems}
                    </SimpleGrid>
                </TabPanel>
                <TabPanel m='auto' w={['90%', null, '78%']}>
                    <SimpleGrid columns={[1, 2, 4]}>
                        {isLoading ? skeletons(8) : unboxedItems.length===0 ? <EmptyList /> : unboxedItems}
                    </SimpleGrid>
                </TabPanel>
            </TabPanels>
        </Tabs>
        :
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
        }
        <AddressFooter
            chainId={currentNetwork}
        />
        <Footer />
        </>
    );
}
