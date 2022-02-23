import { useDonate } from "contexts/DonateContext";
import {
    Box,
    Heading,
    Text,
    List,
    ListItem
  } from '@chakra-ui/react'

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
        <Heading  fontSize='xl' align='center'>Price Range</Heading>
       <List>
        {priceRange? priceRange.map((range, idx) => <li id={idx}> <ListItem><Text align='left' fontSize='lg'>{ethers.utils.formatEther(range.fromAmount)} for: {ethers.utils.formatEther(range.price)} </Text></ListItem></li>) : '0.0'}
      </List>
      </Box>
    )
}