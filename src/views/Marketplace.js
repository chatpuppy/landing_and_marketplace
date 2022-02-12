import React from 'react';
import Footer from 'components/Footer';
import NavBar from 'components/NavBar';
import AddOrderModal from 'components/marketplace/AddOrderModal';

export default function Marketplace() {
  return (
      <>
      <NavBar />
      <AddOrderModal />
      <Footer />
      </>
  );
}
