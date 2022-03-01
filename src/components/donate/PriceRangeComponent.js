import { useDonate } from "contexts/DonateContext";
import {
    Box,
    Heading,
    Text,
    List,
    ListItem
  } from '@chakra-ui/react'

import { ethers } from "ethers";

export default function PriceRangeComponent() {
    const { priceRange } = useDonate()
    return (
      <Box
      margin={{
        base: '20px',
        lg: '10px'
      }}
      direction={{
        base: 'column',
        lg: 'row',
      }}>
        <Heading  fontSize='xl' align='center'>Rate List</Heading>
       <List>
        {priceRange? priceRange.map((range, idx) => <ListItem id={idx}><Text align='left' fontSize='lg'>{ethers.utils.formatEther(range.fromAmount)} for: {ethers.utils.formatEther(range.price)} </Text></ListItem>) : '0.0'}
      </List>
      </Box>
    )
}