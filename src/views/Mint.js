import React, { useEffect } from 'react';
import Footer from 'components/Footer';
import NavBar from 'components/NavBar';
import MintGrid from 'components/mint/MintGrid';

import { useAuth } from 'contexts/AuthContext';
import { Button, Center, useToast } from '@chakra-ui/react';

import { checkIfWalletIsConnected, connectWallet } from 'services/walletConnections';

export default function Mint() {

  const { currentAccount, setCurrentAccount } = useAuth();
  const toast = useToast();
  const id = 'toast'

  const handleLogin = async() => {
    if(!window.ethereum) {
      if (!toast.isActive(id)) {
        toast({
          id,
          title: 'No wallet found',
          description: "Please install Metamask",
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
      }
      return;
    }
    const addr = await connectWallet();
    setCurrentAccount(addr)
  }

  useEffect(() => {
    const getAccount = async() => {
      if(!window.ethereum) {
        toast({
          title: 'No wallet found',
          description: "Please install Metamask",
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
      } else {
        setCurrentAccount(await checkIfWalletIsConnected());
      }
    }
    getAccount()
  }, [setCurrentAccount, toast]);
  

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
