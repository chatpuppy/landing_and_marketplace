import React from 'react';
import Footer from 'components/Footer';
import NavBar from 'components/NavBar';
import MintGrid from 'components/mint/MintGrid';
import AddressFooter from 'components/AddressFooter';

export default function Mint() {

  return (
        <>
        <NavBar />
        <MintGrid />
        <AddressFooter />
        <Footer />
        </>
  );
}
