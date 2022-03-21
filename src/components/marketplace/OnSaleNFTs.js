import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from 'contexts/AuthContext';
import ListedCard from './ListedCard';
import { Stack, Skeleton } from '@chakra-ui/react';
import EmptyList from 'components/EmptyList';
import {skeleton} from '../common/LoadingSkeleton';

export default function OnSaleNFTs() {

    const { currentAccount, listedNFTs } = useAuth()
    const [ onSaleItems, setOnSaleItems ] = useState([]);
    // const [ isLoading, setIsLoading ] = useState();

    let _onSaleNFTs = [];
    
    const setOnSaleNFTs = useCallback(async() => {
        // setIsLoading(true);
        if(!currentAccount) return;
        try {
            if(_onSaleNFTs.length !== 0 && onSaleItems.length === 0) {
                let arr = [];
                // eslint-disable-next-line array-callback-return
                _onSaleNFTs.map((number, index) => {
                    if(_onSaleNFTs[index].deleted) arr.push(skeleton(index));
                    else arr.push(
                        <ListedCard 
                            key={parseInt(_onSaleNFTs[index]['orderId'])} 
                            tokenId={parseInt(_onSaleNFTs[index]['tokenId']["_hex"], 16)} 
                            owner={_onSaleNFTs[index]['seller']}
                            orderId={_onSaleNFTs[index]['orderId']}
                            price={_onSaleNFTs[index]['price']}
                            unboxed={_onSaleNFTs[index]['unboxed']}
                            metadata={_onSaleNFTs[index]['_artifacts']}
                            dna={_onSaleNFTs[index]['_dna']}
                            paymentToken={_onSaleNFTs[index]['paymentToken']}
                            callback={(orderId) => deleteFromOnSaleItems(orderId)}
                        />
                    )
                });
                setOnSaleItems(arr);
            } else {
                setOnSaleItems(<EmptyList />);
            }
        } catch(err) {
            console.log(err)
        } 
    }, [currentAccount])

    useEffect(() => {
        let isConnected = false;
        if(!isConnected) {
            if(listedNFTs) {
                for(let i=0; i<listedNFTs.length; i++) {
                    if(listedNFTs[i]['seller'].toLowerCase() !== currentAccount.toLowerCase()) {
                        _onSaleNFTs.push(listedNFTs[i])
                    }
                }
                setOnSaleNFTs();
            }
        }
        
        return () => {
            isConnected = true;
        }
    }, [listedNFTs])
    
    const deleteFromOnSaleItems = (key) => {
        let deletedKey = 0;
        for(let i=0; i < _onSaleNFTs.length; i++) {
            const item = _onSaleNFTs[i];
            if(parseInt(item.orderId) === parseInt(key)) {
                item.deleted = true;
                deletedKey = i;
                break;
            }
        }
        setOnSaleNFTs();
        setTimeout(() => {
            _onSaleNFTs.splice(deletedKey, 1);
            setOnSaleNFTs();
        }, 3000);
    }

    return (
        <>
            {onSaleItems.length===0 ?
            // isLoading ?
            // <Stack p={50}>
            //     <Skeleton bg="gray.400" height='20px' />
            //     <Skeleton bg="gray.400" height='60vh' />
            //     <Skeleton bg="gray.400" height='20px' />
            // </Stack>
            // :
            <EmptyList />
            :
            onSaleItems
            }
        </>
    )
}
