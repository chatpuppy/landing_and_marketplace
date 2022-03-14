import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from 'contexts/AuthContext';
import ListedCard from './ListedCard';
import { Stack, Skeleton } from '@chakra-ui/react';
import EmptyList from 'components/EmptyList';

export default function OnSaleNFTs() {

    const { currentAccount, listedNFTs } = useAuth()
    const [ onSaleItems, setOnSaleItems ] = useState([]);
    const [ isLoading, setIsLoading ] = useState()

    const setOnSaleNFTs = useCallback(async() => {
        setIsLoading(true);
        if(!currentAccount) return;
        let _ownedListedNFTs = [];
        try {
            for(let i=0; i<listedNFTs.length; i++) {
                if(listedNFTs[i]['seller'].toLowerCase() !== currentAccount.toLowerCase()) {
                    _ownedListedNFTs.push(listedNFTs[i])
                }
            }
            if(onSaleItems.length<_ownedListedNFTs.length) {
                setOnSaleItems(onSaleItems.concat(Array.from({length: _ownedListedNFTs.length}, (_, i) => i).map((number, index) => 
                    <ListedCard 
                        key={parseInt(_ownedListedNFTs[index]['tokenId']["_hex"], 16)} 
                        tokenId={parseInt(_ownedListedNFTs[index]['tokenId']["_hex"], 16)} 
                        owner={_ownedListedNFTs[index]['seller']}
                        orderId={_ownedListedNFTs[index][5]}
                        price={_ownedListedNFTs[index][4]}
                        unboxed={_ownedListedNFTs[index]['unboxed']}
                        metadata={_ownedListedNFTs[index]['_artifacts']}
                        dna={_ownedListedNFTs[index]['_dna']}
                        paymentToken={_ownedListedNFTs[index]['paymentToken']}
                    />
                )))
            }
        } catch(err) {
            console.log(err)
        } finally {
            setIsLoading(false)
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
    
    return (
        <>
            {onSaleItems.length===0 ?
            isLoading ?
            <Stack p={50}>
                <Skeleton bg="gray.400" height='20px' />
                <Skeleton bg="gray.400" height='60vh' />
                <Skeleton bg="gray.400" height='20px' />
            </Stack>
            :
            <EmptyList />
            :
            onSaleItems
            }
        </>
    )
}
