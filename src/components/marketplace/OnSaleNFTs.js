import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from 'contexts/AuthContext';
import ListedCard from './ListedCard';
import { Stack, Skeleton } from '@chakra-ui/react';

export default function OnSaleNFTs() {

    const { currentAccount, listedNFTs } = useAuth()
    const [ onSaleItems, setOnSaleItems ] = useState([]);

    const setOnSaleNFTs = useCallback(async() => {
        if(!currentAccount) return;
        let _ownedListedNFTs = [];
        try {
            for(let i=0; i<listedNFTs.length; i++) {
                if(listedNFTs[i][0].toLowerCase()!==currentAccount.toLowerCase()) {
                    _ownedListedNFTs.push(listedNFTs[i])
                }
            }
            if(onSaleItems.length<_ownedListedNFTs.length) {
                setOnSaleItems(onSaleItems.concat(Array.from({length: _ownedListedNFTs.length}, (_, i) => i).map((number, index)=>
                    <ListedCard key={parseInt(_ownedListedNFTs[index][2]["_hex"], 16)} id={parseInt(_ownedListedNFTs[index][2]["_hex"], 16)
                    
                } />
                )))
            }
            
        } catch(err) {
            console.log(err)
        }
    }, [currentAccount, listedNFTs, setOnSaleItems, onSaleItems])

    useEffect(() => {

        let isConnected = false;
        if(!isConnected) {
            if(listedNFTs) {
                setOnSaleNFTs();
            }
        }
        
        return () => {
            isConnected = true;
        }
    }, [setOnSaleNFTs, listedNFTs])
    
    console.log(onSaleItems)

    return (
        <>
            {onSaleItems.length===0 ?
            <Stack p={50}>
                <Skeleton bg="gray.400" height='20px' />
                <Skeleton bg="gray.400" height='60vh' />
                <Skeleton bg="gray.400" height='20px' />
            </Stack>
            :
            onSaleItems
            }
        </>
        
    )
}
