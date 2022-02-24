import donateABI from "abi/TokensVesting_abi";
import { TOKEN_VESTING_ADDRESS } from "constants";

import { ethers } from "ethers";

const { ethereum } = window; //injected by metamask
//connect to an ethereum node
const provider = new ethers.providers.Web3Provider(ethereum); 
//gets the account
const signer = provider.getSigner(); 

export const tokenVestingContract = new ethers.Contract(
    TOKEN_VESTING_ADDRESS,
    donateABI, 
    signer
  );

export const loadCrowdFundingParams = async (participant) => {
    const response = await tokenVestingContract.crowdFundingParams(
        participant
      );
    return response
}

export const totalDonateAmount = async () => {
    const response = await tokenVestingContract.total();
    return response
}

export const loadParticipantReleasable = async (participant) =>  {
    const response = await tokenVestingContract.participantReleasable(participant);
    console.log("loadParticipantReleasable", response)
    return response
}
export const loadTotalParticipant = async (participant) =>  {
    const response = await tokenVestingContract.getTotalAmountByParticipant(participant);
    console.log("loadTotalParticipant", response)
    return response
}
export const loadParticpantReleased = async (participant) =>  {
    const response = await tokenVestingContract.participantReleasable(participant);
    console.log("loadParticpantReleased", response)
    return response 
}
export const loadParticipantPriceRange = async (participant) =>  {
    const response = await tokenVestingContract.priceRange(participant);
    console.log("loadParticipantPriceRange", response)
    return response
}

export const loadBeneficiaryCount = async (participant) =>  {
    const response = await tokenVestingContract.getBeneficiaryCountParticipant(participant);
    console.log("loadBeneficiaryCount", response)
    return response
}

export const loadCap = async (participant) => {
    const response = await tokenVestingContract.getCap(participant);
    console.log("loadCap", response)
    return response
}

export const loadIndex = async (participant, address) => {
    const response = await tokenVestingContract.getIndex(participant, address);
    console.log("loadIndex", response)
    return response
}
