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
    // if(participant !== 1 || participant !== 2) return false;
    const response = await tokenVestingContract.crowdFundingParams(
        participant
      );
    return response
}

export const loadCap = async (participant) => {
    // if(participant !== 1 || participant !== 2) return false;
    const response = await tokenVestingContract.getCap(participant);
    return response
}


export const totalDonateAmount = async () => {
    const response = await tokenVestingContract.total();
    return response
}

export const loadParticipantReleasable = async (participant) =>  {
    const response = await tokenVestingContract.participantReleasable(participant);
    return response
}
export const loadTotalParticipant = async (participant) =>  {
    const response = await tokenVestingContract.getTotalAmountByParticipant(participant);
    return response
}
export const loadParticpantReleased = async (participant) =>  {
    const response = await tokenVestingContract.participantReleasable(participant);
    return response 
}

export const loadParticipantPriceRange = async (participant) =>  {
    // if(participant !== 1 || participant !== 2) return false;
    const response = await tokenVestingContract.priceRange(participant);
    return response
}

/**
 * Get beneficiary count from contract
 * @param {*} participant 
 * @returns 
 */
export const loadBeneficiaryCount = async (participant) =>  {
    const response = await tokenVestingContract.getBeneficiaryCountParticipant(participant);
    return response
}

/**
 * Get beneficiary index
 * @param {*} participant 
 * @param {*} address 
 * @returns 
 */
export const loadIndex = async (participant, address) => {
    if(address === undefined) return;
    const response = await tokenVestingContract.getIndex(participant, address);
    return response
}

/**
 * Get benificial details
 * @param {*} index 
 * @returns 
 */
export const loadBeneficiary = async (index) => await tokenVestingContract.getBeneficiary(index);

/**
 * Get all beneficiary count
 */
export const loadBeneficiaryCountAll = async () => await tokenVestingContract.getBeneficiary();

/**
 * Get estimated rate for the given amount
 */
export const loadPriceForAmount = async (participant, amount) => {
    if(participant !== 1 && participant !== 2) return false;
    return await tokenVestingContract.getPriceForAmount(participant, amount);
}

/**
 * Get releasable amount
 * @returns 
 */
export const loadReleasable = async (participant, address) => {
    if(address === undefined) return;
    const res = await loadIndex(participant, address);
    if(res[0]) return await tokenVestingContract.releasable(res[1].toString());
    else return 0;
}

/**
 * Get redeemFee
 * @returns 
 */
export const loadRedeemFee = async () => await tokenVestingContract.redeemFee();
