import React, { useEffect } from "react";
import Home from "views/Home";
import Mint from "views/Mint";
import Marketplace from "views/Marketplace"
import Account from "views/Account";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";

function App() {

  const { setCurrentAccount } = useAuth()

  useEffect(() => {
    try {
      window.ethereum.on('accountsChanged', function (accounts) {
        // Time to reload your interface with accounts[0]!
        console.log(accounts[0]);
        setCurrentAccount(accounts[0]);
        window.location.reload();
      })
      
      window.ethereum.on('chainChanged', function (chainId) {
        // Time to reload your interface with the new chainId
        console.log(chainId)
      })
    } catch(err) {
      console.log(err)
    }

  }, [setCurrentAccount]);
  

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/mint" element={<Mint />}/>
          <Route path="/marketplace" element={<Marketplace />}/>
          <Route path="/account" element={<Account />}/>
        </Routes>
    </Router>
  );
}

export default App;
