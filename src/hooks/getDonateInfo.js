// import React, { useState,   useEffect } from "react";

// import { TOKEN_VESTING_ADDRESS } from "constants";
// import donateABI from "abi/TokensVesting_abi";

// import { ethers } from "ethers";
// import { useAuth } from "contexts/AuthContext";

// export const getDonateInfo = async(participant) => {


//     const [ isLoading, setIsLoading ] = useState(false);
//     const { currentAccount, currentNetwork } = useAuth()
//     const toast = useToast()
//     const id = 'toast'

//     const [totalAmount, setTotal] = useState(0)
//     const [releasable, setReleasable] = useState(0)
//     const [price, setPrice] = useState(0)    
//     const [donateData, setDataDonate] = useState();
//     const [participantTotal, setTotalParticipant] = useState(0);
//     const [participantReleasable, setParticipantReleasable] = useState(0);
//     const [participantReleased, setParticipantReleased] = useState(0);
//     const [priceRange, setParticipantPriceRange] = useState(0);
//     const [allReleasable, setAllReleasable] = useState(0);
//     const [participantID, setParticipantID] = useState(0);
//     const [donateStatus, setDonationStatus] = useState(false);
//     const [donateTX, setDonationTX] = useState();
//     const [donateAmount, setDonateAmount] = useState();
//     const [priceForAmount, setPriceForAmount] = useState();
//     const [beneficiaryCount, setBeneficiaryCount] = useState();
        
//     if((!window.ethereum) || (!currentAccount)){
//         if (!toast.isActive(id)) {
//           toast({
//             id,
//             title: 'No wallet found',
//             description: "Please install Metamask",
//             status: 'error',
//             duration: 4000,
//             isClosable: true,
//           })
//         }
//         return;
//       }

//     if(currentNetwork!==42) {
//     if (!toast.isActive(id)) {
//         toast({
//         id,
//         title: 'Wrong network',
//         description: "Please change network to Kovan Testnet",
//         status: 'error',
//         duration: 4000,
//         isClosable: true,
//         })
//     }
//     return;
//     }
//     setIsLoading(true);

//     try {
//       const { ethereum } = window; //injected by metamask
//       const provider = new ethers.providers.Web3Provider(ethereum); 
//       const signer = provider.getSigner(); 

//       const participant = participantID;
//       const TokenVestingContract = new ethers.Contract(TOKEN_VESTING_ADDRESS, donateABI, signer);

//       const timestamp = Date.now();


//       async function CrowdFundingParams() {
//         const response = await TokenVestingContract.crowdFundingParams(participant)
//         setDataDonate(response);
//       }
      
//       async function totalAmount() {
//         const response = await TokenVestingContract.total()
//         setTotal(response);
//       }

//       async function participantReleasable() {
//         const response = await TokenVestingContract.participantReleasable(participant)
//         setParticipantReleasable(response)
//       }

//       async function totalParticipant(){
//         const response = await TokenVestingContract.getTotalAmountByParticipant(participant)
//         setTotalParticipant(response)
//       }

//       async function particpantReleased(){
//         const response = await TokenVestingContract.participantReleased(participant)
//         setParticipantReleased(response)
//       }

//       async function participantPriceRange(){
//         const response = await TokenVestingContract.priceRange(participant)
//         setParticipantPriceRange(response)
//       }

//       async function getBeneficiaryCountParticipant() {
//         const response = await TokenVestingContract.getBeneficiaryCountParticipant(participant)
//         setBeneficiaryCount(response)
//       }
     

//       // async function allRleasable(){
//       //   const response = await TokenVestingContract.releasable()
//       //   setReleasable(response)
//       // }
      

//       async function donateStatus(){
//         const status = donateData ? donateData.startTimestamp < timestamp ? false : timestamp > donateData.endTimestamp ? false : true : false
//         setDonationStatus(status)
//       }

//       async function getParticipantID(){
//         setParticipantID(participant)
//       }
      
//       CrowdFundingParams()
//       getParticipantID()
//       totalAmount()
//       participantReleasable()
//       totalParticipant()
//       particpantReleased()
//       participantPriceRange()
//       // allRleasable()
//       donateStatus()
//       getBeneficiaryCountParticipant()
      
      
      
//     } catch(err) {
//       setIsLoading(false);
//     }
// }
