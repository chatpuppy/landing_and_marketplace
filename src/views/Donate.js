import { Box, Container } from '@chakra-ui/react'
import React from 'react'
import Footer from 'components/Footer'
import NavBar from 'components/NavBar'
import DonateUI from 'components/donate/donateUI'

export default function Donate() {
  return (
    <Box as="section" height="100vh" overflowY="auto">
      <NavBar />
      <Container maxW='container.lg'>
      <DonateUI />
      </Container>
      
      <Footer />
    </Box>
  )
}
