import React, { useEffect, useState } from "react";
import Home from "views/Home";
import Mint from "views/Mint";
import Marketplace from "views/Marketplace"
import Account from "views/Account";
import Donate from "views/Donate";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import { ethers } from "ethers";
import donateABI from "abi/TokensVesting_abi";

import { TOKEN_VESTING_ADDRESS } from "constants";

function App() {

  const { setCurrentAccount, setCurrentNetwork, setTokenVestingContract } = useAuth()
  
  useEffect(() => {

    const initialCheck = async() => {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setCurrentNetwork(parseInt(chainId, 16))
  
        window.ethereum.on('accountsChanged', function (accounts) {
          // Time to reload your interface with accounts[0]!
          console.log(accounts[0])
          setCurrentAccount(accounts[0]);
          window.location.reload()
        })
        
        window.ethereum.on('chainChanged', function (chainId) {
          // Time to reload your interface with the new chainId
          setCurrentNetwork(parseInt(chainId, 16))
          window.location.reload()
        })

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const TokenVestingContract = new ethers.Contract(
          TOKEN_VESTING_ADDRESS,
          donateABI,
          signer
        );

        setTokenVestingContract(TokenVestingContract)

      } catch(err) {
        console.log(err)
      }
    }
    initialCheck();

  }, [setCurrentAccount, setCurrentNetwork,  setTokenVestingContract]);
  
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/mint" element={<Mint />}/>
          <Route path="/marketplace" element={<Marketplace />}/>
          <Route path="/account" element={<Account />}/>
          <Route path="/donate" element={<Donate />}/>
        </Routes>
    </Router>
  );
}

export default App;
