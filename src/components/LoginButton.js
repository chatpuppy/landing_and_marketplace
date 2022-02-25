import React, { useEffect } from 'react'
import { Button, Image, useToast } from '@chakra-ui/react';
import { checkIfWalletIsConnected ,connectWallet } from 'services/walletConnections';
import { useAuth } from 'contexts/AuthContext';

import BNBLogo from "assets/bnb-logo.svg"
import ETHLogo from "assets/eth-logo.svg"

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
          <Button>
            <Image src={currentNetwork === 56 || currentNetwork === 97 ? BNBLogo : ETHLogo} h="15px" mr="2"/>
            {currentAccount.substring(0, 5)+"...."+currentAccount.substring(currentAccount.length-6)}
          </Button>
          /*
          <Box>
          <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {currentAccount.substring(0, 5)+"...."+currentAccount.substring(currentAccount.length-6)}
          </MenuButton>
          <MenuList >
            <MenuItem>Sample</MenuItem>
          </MenuList>
          </Menu>
          </Box> 
          */
            : 
            <Button onClick={handleLogin}>
              Connect Wallet
            </Button>
          }
          </>

  )
}
