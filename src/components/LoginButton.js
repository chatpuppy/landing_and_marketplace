import React, { useEffect } from 'react'
import { Button, Image, useToast, Box, Menu, MenuButton, MenuList, MenuItem, ChevronDownIcon } from '@chakra-ui/react';
import { checkIfWalletIsConnected ,connectWallet } from 'services/walletConnections';
import { useAuth } from 'contexts/AuthContext';

import BNBLogo from "assets/bnb-logo.svg";
import ETHLogo from "assets/eth-logo.svg";
import MATICLogo from "assets/matic-logo.svg";
import FTMLogo from "assets/ftm-logo.svg";
import AVAXLogo from "assets/avax-logo.svg";

export default function LoginButton() {

  const toast = useToast();
  const id = 'toast'
  const { currentAccount, setCurrentAccount, currentNetwork } = useAuth();
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
  const logo = (chainId) => {
    if(chainId === 97 || chainId === 56) return BNBLogo;
    else if(chainId === 80001 || chainId === 137) return MATICLogo;
    else if(chainId === 1 || chainId === 3 || chainId === 4 || chainId === 42 || chainId === 5) return ETHLogo;
  }

  useEffect(() => {
    const getAccount = async() => {
      if(window.location.pathname!=="/") {
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
        } else {
          setCurrentAccount(await checkIfWalletIsConnected());
        }
      }
    }
    getAccount()
    }, [setCurrentAccount, toast]);

  return (
          <>
          { currentAccount ? 
          <Box>
          <Button>
            <Image src={logo(currentNetwork)} h="15px" mr="2"/>
            {currentAccount.substring(0, 7)+"...."+currentAccount.substring(currentAccount.length-6)}
          </Button>
          {/* <Box>
          <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {currentAccount.substring(0, 5)+"...."+currentAccount.substring(currentAccount.length-6)}
          </MenuButton>
          <MenuList >
            <MenuItem>Sample</MenuItem>
          </MenuList>
          </Menu>
          </Box>  */}
          </Box>
            : 
            <Button onClick={handleLogin}>
              Connect Wallet
            </Button>
          }
          </>

  )
}
