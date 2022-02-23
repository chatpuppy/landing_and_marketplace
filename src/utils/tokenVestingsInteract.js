import donateABI from "abi/TokensVesting_abi";
import { TOKEN_VESTING_ADDRESS } from "constants";

import { ethers } from "ethers";

const { ethereum } = window; //injected by metamask
const provider = new ethers.providers.Web3Provider(ethereum); 
const signer = provider.getSigner(); 

export const tokenVestingContract = new ethers.Contract(
    TOKEN_VESTING_ADDRESS,
    donateABI, 
    signer
  );

export const loadCrowdFundingParams = async (beneficiaryID) => {
    const participant = beneficiaryID ? beneficiaryID : 2;
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
    const response = await tokenVestingContract.priceRange(participant);
    return response
}


export const loadBeneficiaryCount = async (participant) =>  {
    const response = await tokenVestingContract.getBeneficiaryCountParticipant(participant);
    return response
}

export const loadCap = async (participant) => {
    const response = await tokenVestingContract.getCap(participant);
    return response
}

export const loadIndex = async (participant, address) => {
    const response = await tokenVestingContract.getIndex(participant, address);
    return response
}
      // let userIndex = await tokenVestingContract.getIndex()
      // setUserIndexHash(response[0]);
      // setUserIndex(response[1]);

      // setBeneficiaryData(response);
      // setBeneficiaryReleased(response)

      

      // async function getIndex() {
      //   const response = await tokenVestingContract.getIndex(
      //     participant,
      //     address
      //   );
      //   setUserIndexHash(response[0]);
      //   setUserIndex(response[1]);
      // }

      // // async function getBeneficiaryData() {
      // //   const response = await tokenVestingContract.getBeneficiary(userIndex);
      // //   setBeneficiaryData(response);
      // // }

      // let released = await tokenVestingContract.released();
      // setBeneficiaryReleased(released)
      

      
      // // let releasable = await tokenVestingContract.releasable();
      // // setBeneficiaryReleasable(releasable)
      

      // let beneficiaryRedeem = await tokenVestingContract.redeem(participant);
      // setBeneficiaryRedeem(beneficiaryRedeem);
      

      // let getParticipantRelease = await tokenVestingContract.release(
      //   participant
      // );
      // setBeneficiaryReleasable(getParticipantRelease);



      // async function donateStatus(){
      //   const status = donateData ? donateData.startTimestamp < timestamp ? false : timestamp > donateData.endTimestamp ? false : true : false
      //   setDonationStatus(status)
      // }

