import React, { useEffect } from 'react'
import { Button, useToast, Menu, Box,
    MenuButton, MenuList, MenuItem
} from '@chakra-ui/react';
import { checkIfWalletIsConnected ,connectWallet } from 'services/walletConnections';
import { useAuth } from 'contexts/AuthContext';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from "react-router-dom";

export default function LoginButton() {

    const toast = useToast();
    const id = 'toast'
    const { currentAccount, setCurrentAccount } = useAuth();

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
            { currentAccount ? 
            <Box>
            <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                {currentAccount.substring(0, 5)+"...."+currentAccount.substring(currentAccount.length-6)}
            </MenuButton>
            <MenuList >
            <RouterLink to="/donate">
              <MenuItem >Donate</MenuItem>
            </RouterLink>
            <RouterLink to="/mint">
              <MenuItem >Mint</MenuItem>
            </RouterLink>          
            <RouterLink to="/marketplace">
              <MenuItem >Marketplace</MenuItem>
            </RouterLink>          
            </MenuList>
            </Menu>
            </Box>
             : 
             <Button onClick={handleLogin}>
                Log In
             </Button>
            }
            </>

    )
}
