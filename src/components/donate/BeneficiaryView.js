import { Stack, Heading, SimpleGrid, Text, Button, Box , useBreakpointValue} from '@chakra-ui/react'
import { Card } from '../common/Card';
import { useDonate } from "contexts/DonateContext";
import { getNameSaleById } from "utils/getNameSaleById";
import PriceRangeComponent  from "./PriceRangeComponent";

import { ethers } from "ethers";

export const BeneficiaryView = () => {
    const {participantID, totalAmount, beneficiaryCount, priceRange} = useDonate()
    return (
        <Stack
          spacing={{
            base: "8",
            lg: "6",
          }}
        >
          <Stack
            spacing="4"
            direction={{
              base: "column",
              lg: "row",
            }}
            justify="space-between"
          >
            <Stack spacing="1">
              <Heading
                size={useBreakpointValue({
                  base: "xs",
                  lg: "sm",
                })}
                fontWeight="medium"
              ></Heading>
            </Stack>
          </Stack>
          <Stack>
            <Heading>Beneficiary on {participantID ? getNameSaleById(participantID) : ""}</Heading>
          </Stack>
          <Stack
            spacing={{
              base: "5",
              lg: "6",
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
                <Text alignItems={'center'} justifyContent={'center'} m={5} fontSize='2xl'>Total: {ethers.utils.formatEther(totalAmount)}</Text>
              </Card>
      
              <Card>
                <Text alignItems={'center'} justifyContent={'center'} m={5} fontSize='2xl'>Beneficiary: {ethers.utils.formatEther(beneficiaryCount)}</Text>
              </Card>
              <Card>
                { priceRange ? <PriceRangeComponent /> : '' }
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
            ></SimpleGrid>
          </Stack>
          <Card minH="xs">
            <SimpleGrid columns={2} spacing={10}>
              <Card>
                {/* <TableDonated /> */}
              </Card>
              <Card>
                 <DonatedButtons />
              </Card>
            </SimpleGrid>
          </Card>
        </Stack>
          
      )
}

const DonatedButtons = () => (
    <Box
    justifyContent={"center"}
    textAlign={"center"}
    as={"form"}
    mt={10}
    mr={10}
    borderRight={20}
  >
    <Button
      fontFamily={"heading"}
      mt={8}
      w={"full"}
      bgGradient="linear(to-r, red.400,pink.400)"
      color={"white"}
      _hover={{
        bgGradient: "linear(to-r, red.400,pink.400)",
        boxShadow: "xl",
      }}
      onClick={() => console.log('release')}
    >
      Release
    </Button>
    <Button
      fontFamily={"heading"}
      mt={8}
      w={"full"}
      bgGradient="linear(to-r, red.400,pink.400)"
      color={"white"}
      _hover={{
        bgGradient: "linear(to-r, red.400,pink.400)",
        boxShadow: "xl",
      }}
      onClick={() => console.log('Reedeem')}
    >
      Reedeem
    </Button>
  </Box>
  )