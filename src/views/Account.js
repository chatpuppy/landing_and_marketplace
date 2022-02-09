import React, { useState, useEffect, useCallback } from 'react';
import Footer from 'components/Footer';
import NavBar from 'components/NavBar';
import { useAuth } from 'contexts/AuthContext';
import { ethers } from "ethers";
import nft_core_abi from "abi/nft_core_abi.json"
import nft_manager_abi from "abi/nft_manager_abi.json"
import { checkIfWalletIsConnected, connectWallet } from 'services/walletConnections';
import { Button, SimpleGrid, useColorModeValue, Skeleton, useToast,
    Tabs, TabList, TabPanels, Tab, TabPanel, Center, Stack
} from '@chakra-ui/react';
import NFTCard from 'components/account/NFTCard';

import { AiOutlineStar } from "react-icons/ai"
import { BsBoxSeam } from "react-icons/bs"

export default function Account() {


    const NFT_core_contract_address = "0xAb50F84DC1c8Ef1464b6F29153E06280b38fA754"
    const NFT_manager_contract_address = "0x0528E41841b8BEdD4293463FAa061DdFCC5E41bd"

    const [ isLoading, setIsLoading ] = useState(false);
    const { currentAccount, setOwnedNFTs, setCurrentAccount } = useAuth();
    const [ boxedItems, setBoxedItems ] = useState([]);
    const [ unboxedItems, setUnboxedItems ] = useState([]);

    const toast = useToast();
    const id = 'toast'

    const getOwnedTokens = useCallback(async() => {
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
            const NFTManagerConnectedContract = new ethers.Contract(NFT_manager_contract_address, nft_manager_abi, signer);
            let count = await NFTCoreConnectedContract.balanceOf(currentAccount);
            count = parseInt(count["_hex"], 16);
            let _ownedNFTs = []
            let _boxedItems = []
            let _unboxedItems = []
            for(let i=0; i<count; i++) {
                let _id = await NFTCoreConnectedContract.tokenOfOwnerByIndex(currentAccount, i);
                _id = parseInt(_id["_hex"], 16)
                const _type = await NFTManagerConnectedContract.boxStatus(_id);
                _ownedNFTs.push([_id, _type]);
                if(_type===0) _boxedItems.push(_id);
                else _unboxedItems.push(_id);
            }
            setOwnedNFTs(_ownedNFTs)
            if(_boxedItems.length!==0 && boxedItems.length===0) {
                setBoxedItems(boxedItems.concat(Array.from({length: _boxedItems.length}, (_, i) => i).map((number, index)=>
                <NFTCard key={_boxedItems[index]} number={_boxedItems[index]} unboxed={false}
                    src={"https://www.larvalabs.com/cryptopunks/cryptopunk"+_boxedItems[index]+".png"}
                />
                )))
            }
            if(_unboxedItems.length!==0 && unboxedItems.length===0) {
                setUnboxedItems(unboxedItems.concat(Array.from({length: _unboxedItems.length}, (_, i) => i).map((number, index)=>
                <NFTCard key={_unboxedItems[index]} number={_unboxedItems[index]} unboxed={true}
                    src={"https://www.larvalabs.com/cryptopunks/cryptopunk"+_unboxedItems[index]+".png"}
                />
                )))
            }
        } catch(err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }, [currentAccount, setOwnedNFTs, boxedItems, unboxedItems])

    const handleLogin = async() => {
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
        } else {
            if(currentAccount) return;
            const addr = await connectWallet();
            setCurrentAccount(addr)
        }
        
    }
    
    useEffect(() => {
        let isConnected = false;
        const setAccountInfo = async() => {
            setCurrentAccount(await checkIfWalletIsConnected());
            getOwnedTokens()
        }
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
            setAccountInfo()
        }

        return () => {
            isConnected = true;
        };
    }, [setCurrentAccount, getOwnedTokens, toast]);
    
    const color = useColorModeValue("black", "white")

    return (
        <>
        <NavBar />
        <Center h='100px'>
          <Button onClick={handleLogin}>
            { currentAccount ? currentAccount : "Log In"}
          </Button>
        </Center>
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
        <Tabs rounded="lg" m="auto" isLazy isFitted colorScheme="blue">
            <TabList mb='1em' m="auto" w="80%">
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
                <TabPanel>
                    <SimpleGrid columns={[1, null, 3]} >
                        {boxedItems.length===0 ? "EMPTY" : boxedItems}
                    </SimpleGrid>
                </TabPanel>
                <TabPanel>
                    <SimpleGrid columns={[1, null, 3]} >
                        {unboxedItems.length===0 ? "EMPTY" : unboxedItems}
                    </SimpleGrid>
                </TabPanel>
            </TabPanels>
        </Tabs>
        :
        <Tabs rounded="lg" m="auto" isLazy isFitted colorScheme="blue">
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
                        EMPTY
                    </SimpleGrid>
                </TabPanel>
                <TabPanel>
                    <SimpleGrid columns={[1, null, 3]} >
                        EMPTY
                    </SimpleGrid>
                </TabPanel>
            </TabPanels>
        </Tabs>
        }
        <Footer />
        </>
    );
}
