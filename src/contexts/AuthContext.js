/* eslint-disable react/prop-types */
import React, { useContext, useState } from 'react';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentAccount, setCurrentAccount] = useState();
  const [ownedNFTs, setOwnedNFTs] = useState();
  const [currentNetwork, setCurrentNetwork] = useState();
  const [listedNFTs, setListedNFTs] = useState();
  const [approved, setApproved] = useState();
  const [tokenVestingContract, setTokenVestingContract] = useState();

  const value = {
    currentAccount,
    setCurrentAccount,
    ownedNFTs,
    setOwnedNFTs,
    currentNetwork,
    setCurrentNetwork,
    listedNFTs,
    setListedNFTs,
    approved,
    setApproved,
    tokenVestingContract,
    setTokenVestingContract,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
