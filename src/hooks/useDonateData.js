import React, { useState, useEffect, useCallback } from "react";

import { ethers } from "ethers";
import { useAuth } from "contexts/AuthContext";
import { useDonate } from "contexts/DonateContext";
import { getNameSaleById } from "utils/getNameSaleById";

import donateABI from "abi/TokensVesting_abi";

import { TOKEN_VESTING_ADDRESS } from "constants";


const useDonateData = () =>  {
    const { currentAccount } = useAuth();
    const { participantID, setDataDonate, setParticipantID } = useDonate();
   
    
    const donateQuery = useCallback(async() => {
        if (!participantID) return;
        if (!currentAccount) return;
        let participant = participantID;
        setParticipantID(participant);
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const TokenVestingContract = new ethers.Contract(
                TOKEN_VESTING_ADDRESS,
                donateABI,
                signer
                );

            try {
                let crowdFundingParams = await TokenVestingContract.crowdFundingParams(
                    participant
                  );
                  setDataDonate(crowdFundingParams);
                  console.log(crowdFundingParams);
            } catch (err) {
                console.log(err);
            }
        } catch(e) {
            console.log(e)
        }
    },[currentAccount, participantID, setDataDonate, setParticipantID])


    useEffect(() => {
        let isConnected = false;
        if (!isConnected && participantID) {
            donateQuery();
        }
        return () => {
          isConnected = true;
        }
      }, [donateQuery, participantID]);

      return
}