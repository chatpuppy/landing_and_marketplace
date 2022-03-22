import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from 'contexts/AuthContext';
import ListedCard from './ListedCard';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <EmptyList />
            :
            onSaleItems
            }
        </>
    )
}
