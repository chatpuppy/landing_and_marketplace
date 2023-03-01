/* eslint-disable react/prop-types */
import React, { useContext, useState } from 'react';
const DonateContext = React.createContext();

export function useDonate() {
  return useContext(DonateContext);
}

export function DonateProvider({ children }) {
  const [totalAmount, setTotal] = useState(0);
  const [releasable, setReleasable] = useState(0);
  const [donateData, setDataDonate] = useState();
  const [participantTotal, setTotalParticipant] = useState(0);
  const [participantReleasable, setParticipantReleasable] = useState(0);
  const [participantReleased, setParticipantReleased] = useState(0);
  const [priceRange, setParticipantPriceRange] = useState(0);
  const [participantID, setParticipantID] = useState(0);
  const [priceForAmount, setPriceForAmount] = useState();
  const [beneficiaryCount, setBeneficiaryCount] = useState();
  const [userIndex, setUserIndex] = useState();
  const [beneficiaryData, setBeneficiaryData] = useState();
  const [redeemable, setRedeemable] = useState();
  // const [price, setPrice] = useState(0)
  // const [allReleasable, setAllReleasable] = useState(0);
  // const [donateStatus, setDonationStatus] = useState(false);
  // const [donateTX, setDonationTX] = useState();
  // const [donateAmount, setDonateAmount] = useState();
  // const [dataCap, setCap] = useState();
  // const [userIndexHash, setUserIndexHash] = useState(false);
  // const [beneficiaryReleased, setBeneficiaryReleased] = useState()

  const value = {
    totalAmount,
    setTotal,
    releasable,
    setReleasable,
    donateData,
    setDataDonate,
    participantTotal,
    setTotalParticipant,
    participantReleasable,
    setParticipantReleasable,
    participantReleased,
    setParticipantReleased,
    priceRange,
    setParticipantPriceRange,
    participantID,
    setParticipantID,
    priceForAmount,
    setPriceForAmount,
    beneficiaryCount,
    setBeneficiaryCount,
    userIndex,
    setUserIndex,
    beneficiaryData,
    setBeneficiaryData,
    redeemable,
    setRedeemable,
    // price, setPrice,
    // allReleasable, setAllReleasable,
    // donateStatus, setDonationStatus,
    // donateTX, setDonationTX,
    // donateAmount, setDonateAmount,
    // dataCap, setCap,
    // userIndexHash, setUserIndexHash,
    // beneficiaryReleased, setBeneficiaryReleased,
  };

  return (
    <DonateContext.Provider value={value}>{children}</DonateContext.Provider>
  );
}
