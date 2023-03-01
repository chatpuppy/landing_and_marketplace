import React from 'react';
import Footer from 'components/Footer';
import NavBar from 'components/NavBar';
import MintGrid from 'components/mint/MintGrid';
import AddressFooter from 'components/AddressFooter';
import { useAuth } from 'contexts/AuthContext';

export default function Mint() {
  const { currentNetwork } = useAuth();
  return (
    <>
      <NavBar action="/mint" />
      <MintGrid chainId={currentNetwork} />
      <AddressFooter chainId={currentNetwork} />
      <Footer />
    </>
  );
}
