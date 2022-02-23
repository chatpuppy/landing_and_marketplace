import { Box, Container } from '@chakra-ui/react'
import React from 'react'
import Footer from 'components/Footer'
import NavBar from 'components/NavBar'
import DonateComponent from 'components/donate/DonateComponent'

export default function Donate() {
  return (
    <Box as="section" height="100vh" overflowY="auto">
      <NavBar />
      <Container maxW='container.lg'>
        <DonateComponent />
      </Container>
      <Footer />
    </Box>
  )
}
