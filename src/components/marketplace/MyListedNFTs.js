import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from 'contexts/AuthContext';
import ListedCard from './ListedCard';
import { Stack, Skeleton } from '@chakra-ui/react';
import EmptyList from 'components/EmptyList';
import {skeleton} from '../common/LoadingSkeleton'

export default function MyListedNFTs() {

    const { currentAccount, listedNFTs } = useAuth()
    // const [ onSaleItems, setOnSaleItems ] = useState([]);
    const [ myListedItems, setMyListedItems ] = useState([]);
    // const [ isLoading, setIsLoading ] = useState()

    let _ownedListedNFTs = [];

    const setMyListedNFTs = useCallback(() => {
        // setIsLoading(true);
        if(!currentAccount) return;
        try {
            // if(myListedItems.length < _ownedListedNFTs.length) {
            if(_ownedListedNFTs.length !== 0 && myListedItems.length === 0) {
                let arr = [];
                _ownedListedNFTs.map((number, index) => {
                    if(_ownedListedNFTs[index].deleted) arr.push(skeleton(index));
                    else arr.push(<ListedCard 
                        key={parseInt(_ownedListedNFTs[index]['orderId'])}
                        tokenId={parseInt(_ownedListedNFTs[index]['tokenId']["_hex"], 16)} 
                        owner={_ownedListedNFTs[index]['seller']}
                        orderId={_ownedListedNFTs[index]['orderId']}
                        price={_ownedListedNFTs[index]['price']}
                        unboxed={_ownedListedNFTs[index]['unboxed']}
                        metadata={_ownedListedNFTs[index]['_artifacts']}
                        dna={_ownedListedNFTs[index]['_dna']}
                        paymentToken={_ownedListedNFTs[index]['paymentToken']}
                        callback={(orderId) => deleteFromMyListedItems(orderId)}
                        updatePriceCallback={(orderId, price) => updatePice(orderId, price)}
                    />)}
                );
                setMyListedItems(arr);
            } else {
                setMyListedItems(<EmptyList/>);
            }
        } catch(err) {
            console.log(err)
        } 
    }, [currentAccount]);

    useEffect(() => {
        let isConnected = false;
        if(!isConnected) {
            if(listedNFTs) {
                for(let i = 0; i < listedNFTs.length; i++) {
                    if(listedNFTs[i]['seller'].toLowerCase() === currentAccount.toLowerCase()) {
                        _ownedListedNFTs.push(listedNFTs[i])
                    }
                }
                setMyListedNFTs();
            }
        }
        
        return () => {
            isConnected = true;
        }
    }, [listedNFTs])
    
    const deleteFromMyListedItems = (key) => {
        let deletedKey = 0;
        for(let i = 0; i < _ownedListedNFTs.length; i++) {
            const item = _ownedListedNFTs[i];
            if(parseInt(item.orderId) === parseInt(key)) {
                item.deleted = true;
                deletedKey = i;
                break;
            }
        }
        setMyListedNFTs();
        setTimeout(() => {
            _ownedListedNFTs.splice(deletedKey, 1);
            setMyListedNFTs();
        }, 3000);
    }

    const updatePice = (orderId, price) => {
        for(let i = 0; i < _ownedListedNFTs.length; i++) {
            const item = _ownedListedNFTs[i];
            if(parseInt(item.orderId) === parseInt(orderId)) {
                item.price = price;
                break;
            }
        }
        setMyListedNFTs();
    }

    return (
        <>
            {myListedItems.length===0 ?
            // isLoading ?
            // <Stack p={50}>
            //     <Skeleton bg="gray.400" height='20px' />
            //     <Skeleton bg="gray.400" height='60vh' />
            //     <Skeleton bg="gray.400" height='20px' />
            // </Stack>
            // :
            <EmptyList />
            :
            myListedItems
            }
        </>
    )
}
