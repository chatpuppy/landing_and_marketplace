import React, { useState, useEffect, useCallback } from 'react';
import Footer from 'components/Footer';
import NavBar from 'components/NavBar';
import { useAuth } from 'contexts/AuthContext';
import { ethers } from "ethers";
import nft_core_abi from "abi/nft_core_abi.json"
import nft_manager_abi from "abi/nft_manager_abi"
import { checkIfWalletIsConnected, connectWallet } from 'services/walletConnections';
import { Button, SimpleGrid, useColorModeValue,
    Tabs, TabList, TabPanels, Tab, TabPanel, Center
} from '@chakra-ui/react';
import NFTCard from 'components/account/NFTCard';


export default function Account() {

    const NFT_core_contract_address = "0xAb50F84DC1c8Ef1464b6F29153E06280b38fA754"
    const NFT_manager_contract_address = "0x0528E41841b8BEdD4293463FAa061DdFCC5E41bd"

    const [ isLoading, setIsLoading ] = useState(false);
    const { currentAccount, ownedNFTs, setOwnedNFTs, setCurrentAccount } = useAuth();
    const [ boxItems, setBoxItems ] = useState([]);
    const [ unboxItems, setUnboxItems ] = useState([]);

    console.log(ownedNFTs)

    const getOwnedTokens = useCallback(async() => {
        setIsLoading(true);
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
            let _boxItems = []
            let _unboxItems = []
            for(let i=0; i<count; i++) {
                let _id = await NFTCoreConnectedContract.tokenOfOwnerByIndex(currentAccount, i);
                _id = parseInt(_id["_hex"], 16)
                const _type = await NFTManagerConnectedContract.boxStatus(_id);
                _ownedNFTs.push([_id, _type]);
                if(_type===0) _unboxItems.push(_id);
                else _boxItems.push(_id);
            }
            setOwnedNFTs(_ownedNFTs)
            if(boxItems.length===0) {
                setBoxItems(boxItems.concat(Array.from({length: _boxItems.length}, (_, i) => i).map((number, index)=>
                <NFTCard key={_boxItems[index]} number={_boxItems[index]}
                    src={"https://www.larvalabs.com/cryptopunks/cryptopunk"+_boxItems[index]+".png"}
                />
                )))
            }
            if(unboxItems.length===0) {
                setUnboxItems(unboxItems.concat(Array.from({length: _unboxItems.length}, (_, i) => i).map((number, index)=>
                <NFTCard key={_unboxItems[index]} number={_unboxItems[index]}
                    src={"https://www.larvalabs.com/cryptopunks/cryptopunk"+_unboxItems[index]+".png"}
                />
                )))
            }
        } catch(err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }, [currentAccount, setOwnedNFTs, boxItems, unboxItems])

    const handleLogin = async() => {
        const addr = await connectWallet();
        setCurrentAccount(addr)
    }
    
    useEffect(() => {
        let isConnected = false;
        const setAccountInfo = async() => {
            setCurrentAccount(await checkIfWalletIsConnected());
            getOwnedTokens()
        }
        if(!isConnected) {
            setAccountInfo()
        }

        return () => {
            isConnected = true;
        };

    }, [setCurrentAccount, getOwnedTokens]);
    
    const bg = useColorModeValue("gray.50", "gray.600")

    return (
        <>
        <NavBar />
        <Center h='100px'>
          <Button onClick={handleLogin}>
            { currentAccount ? currentAccount : "Log In"}
          </Button>
        </Center>
        {isLoading 
        ? <Button isLoading colorScheme='teal' variant='outline' ></Button> 
        : 
        <Tabs isFitted variant='enclosed' bg={bg}>
            <TabList mb='1em'>
                <Tab>Mystery Boxes</Tab>
                <Tab>Unboxed NFTs</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <SimpleGrid columns={[1, null, 3]} >
                        {unboxItems}
                    </SimpleGrid>
                </TabPanel>
                <TabPanel>
                    <SimpleGrid columns={[1, null, 3]} >
                        {boxItems}
                    </SimpleGrid>
                </TabPanel>
            </TabPanels>
        </Tabs>
        
        }
        <Footer />
        </>
    );
}
