import React, { useContext, useState } from 'react'

const DonateContext = React.createContext();


export function useDonate() {
    return useContext(DonateContext)
}


export function DonateProvider ({ children }) {
    const [totalAmount, setTotal] = useState(0)
    const [releasable, setReleasable] = useState(0)
    const [price, setPrice] = useState(0)    
    const [donateData, setDataDonate] = useState();
    const [participantTotal, setTotalParticipant] = useState(0);
    const [participantReleasable, setParticipantReleasable] = useState(0);
    const [participantReleased, setParticipantReleased] = useState(0);
    const [priceRange, setParticipantPriceRange] = useState(0);
    const [allReleasable, setAllReleasable] = useState(0);
    const [participantID, setParticipantID] = useState(0);
    const [donateStatus, setDonationStatus] = useState(false);
    const [donateTX, setDonationTX] = useState();
    const [donateAmount, setDonateAmount] = useState();
    const [priceForAmount, setPriceForAmount] = useState();
    const [beneficiaryCount, setBeneficiaryCount] = useState();
    const [dataCap, setCap] = useState();
    const [userIndex, setUserIndex ] = useState();
    const [beneficiaryData, setBeneficiaryData ] = useState();
    
    const value = { 
        totalAmount, setTotal,
        releasable, setReleasable,
        price, setPrice,
        donateData, setDataDonate,
        participantTotal, setTotalParticipant,
        participantReleasable, setParticipantReleasable,
        participantReleased, setParticipantReleased,
        priceRange, setParticipantPriceRange,
        allReleasable, setAllReleasable,
        participantID, setParticipantID,
        donateStatus, setDonationStatus,
        donateTX, setDonationTX,
        donateAmount, setDonateAmount,
        priceForAmount, setPriceForAmount,
        beneficiaryCount, setBeneficiaryCount,
        dataCap, setCap,
        userIndex, setUserIndex ,
        beneficiaryData, setBeneficiaryData,
    }

    return (
        <DonateContext.Provider value={value}>
            {children}
        </DonateContext.Provider>

    )
}