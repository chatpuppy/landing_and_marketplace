import React from 'react'
import Footer from 'components/Footer'
// import AddressFooter from 'components/AddressFooter';
import NavBar from 'components/NavBar'
import DonateComponent from 'components/donate/DonateComponent'

export default function Donate() {
  return (
    <>
      <NavBar action="/donate" />
      <DonateComponent />
			{/* <AddressFooter
        chainId={97}
      /> */}
      <Footer />
    </>
  )
}
