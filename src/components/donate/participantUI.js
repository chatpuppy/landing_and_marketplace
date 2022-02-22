import { useDonate } from "contexts/DonateContext";
import { ethers } from "ethers";
import {
    Box,
    Button,
    Heading,
    SimpleGrid,
    Stack,
    Text,
    useBreakpointValue,
    useColorModeValue,
    useToast,
    HStack,
    Spinner,
    Input,
    InputGroup,
    InputRightElement,
    List,
    ListIcon,
    ListItem
  } from '@chakra-ui/react';


import  TableDonate  from "./tableDonate";
import { getNameSaleById } from "utils/getNameSaleById";


export default function ParticipantUI({participant, data})  {
    
    return (
        <>
        <Stack spacing={{
            base: '8',
            lg: '6',
          }}>
            <Stack
                spacing="4"
                direction={{
                base: 'column',
                lg: 'row',
                }}
                justify="space-between"
            >
                <Stack spacing="1">
                    <Heading
                    size={useBreakpointValue({
                        base: 'xs',
                        lg: 'sm',
                    })}
                    fontWeight="medium"
                    >
                    
                    {/* Donation `${donationStatus}` */}
                    </Heading>
                </Stack>
            </Stack>
            <Stack>
                <Heading>      
                    { participant ? getNameSaleById(participant) : ''}
                </Heading>
            </Stack>
            <Stack
        spacing={{
          base: '5',
          lg: '6',
        }}
      >
        <SimpleGrid
          columns={{
            base: 1,
            md: 3,
          }}
          gap="6"
        >
          <Card>
            <Text fontSize='2xl' justifyContent={"center"}>Total: {ethers.utils.formatEther(totalAmount)}</Text>
          </Card>
          
          <Card>
          <Text fontSize='2xl' justifyContent={"center"}>Beneficiary: {ethers.utils.formatEther(beneficiaryCount)}</Text>
          </Card>
          <Card>
            {/* <PriceRangeComponent priceRange={priceRange} />  */}
          </Card>
        </SimpleGrid>
      </Stack>
      <Stack>
      <SimpleGrid
          columns={{
            base: 1,
            md: 3,
          }}
          gap="6"
        >
          
        </SimpleGrid>
      </Stack>
      <Card minH="xs" >
      <SimpleGrid columns={2} spacing={10}>
        <Card>
          {console.log(donateData)}
        <TableDonate  />
        </Card>
        <Card>
        <Text fontSize='2xl'>Donate</Text>
        <Heading>
          Donation Amount: {donateAmount}
          {/* Price for Amount: {ethers.utils.formatEther(priceForAmount)} */}
        </Heading>
        <InputGroup size='md'>
        <Input
          value={donateAmount}
          pr='4.5rem'
          placeholder='1 ETH'
        />
        <InputRightElement width='4.5rem'>
       
        </InputRightElement>
      </InputGroup>
      <Button
          fontFamily={'heading'}
          mb={2}
          w={'full'}
          bgGradient="linear(to-r, red.400,pink.400)"
          color={'white'}
          _hover={{
              bgGradient: 'linear(to-r, red.400,pink.400)',
              boxShadow: 'xl',
          }}
          _active={{
              bgGradient: 'linear(to-r, red.200,pink.200)',
              boxShadow: 'xl',
          }}

          // onClick={payDonation(ethers.utils.parseEther(donateAmount))}
          >
          Donate
      </Button>
        
        </Card>
        </SimpleGrid>
      </Card>

        </Stack>
        </>
        
    )

}


