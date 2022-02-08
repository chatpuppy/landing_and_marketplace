import React, { useEffect } from 'react';
import Footer from 'components/Footer';
import NavBar from 'components/NavBar';
import MintGrid from 'components/mint/MintGrid';

import { useAuth } from 'contexts/AuthContext';
import { Button, Center } from '@chakra-ui/react';

import { checkIfWalletIsConnected, connectWallet } from 'services/walletConnections';

export default function Mint() {

  const { currentAccount, setCurrentAccount } = useAuth();
  
  const handleLogin = async() => {
    const addr = await connectWallet();
    setCurrentAccount(addr)
  }

  useEffect(() => {
    const getAccount = async() => {
      setCurrentAccount(await checkIfWalletIsConnected());
    }
    getAccount()
  }, [setCurrentAccount]);
  

  return (
        <>
        <NavBar />
        <Center h='100px'>
          <Button onClick={handleLogin}>
            { currentAccount ? currentAccount : "Log In"}
          </Button>
        </Center>
        <MintGrid />
        <Footer />
        </>
  );
}
