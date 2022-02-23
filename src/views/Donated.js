import { Box, Container } from '@chakra-ui/react'
import React from 'react'
import Footer from 'components/Footer'
import NavBar from 'components/NavBar'
import DonatedUI from 'components/donate/donatedUI'

export default function Donated() {
  return (
    <Box as="section" height="100vh" overflowY="auto">
      <NavBar />
      <Container maxW='container.lg'>
        <DonatedUI />
      </Container>
      <Footer />
    </Box>
  )
}
