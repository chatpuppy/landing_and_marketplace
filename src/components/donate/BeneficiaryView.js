import { useState }  from "react";
import { Stack, Heading, SimpleGrid, Text, Button, Box , useBreakpointValue,  useToast} from '@chakra-ui/react'
import { Card } from '../common/Card';
import { useAuth } from "contexts/AuthContext";
import { useDonate } from "contexts/DonateContext";
import { getNameSaleById } from "utils/getNameSaleById";
import PriceRangeComponent  from "./PriceRangeComponent";

import { ethers } from "ethers";

export const BeneficiaryView = () => {
    const {participantID, totalAmount, beneficiaryCount, priceRange} = useDonate()
    const [ isLoading, setIsLoading ] = useState(false);
    const { currentAccount, currentNetwork, tokenVestingContract } = useAuth()
    const toast = useToast()
    const id = 'toast'

    let uint8 = new Uint8Array(2);
    uint8[0] = participantID;
    let participant = uint8[0];

    const actionRedeem = async() => {
      if (!currentAccount && !currentNetwork === 42) return 0
      setIsLoading(true);
      try {
        await tokenVestingContract.redeem(participant)
        toast({
          title: 'Redeem',
          description: `Redeem now`,
          status: 'sucess',
          duration: 4000,
          isClosable: true,
      })
      setTimeout(()=>{
          window.location.reload();
      }, 5000)
      } catch(err) {
        console.log(err)
        setIsLoading(false);
      }
    }

    const actionRelease = async() => {
      if (!currentAccount && !currentNetwork === 42) return 0
      setIsLoading(true);
      try {
        await tokenVestingContract.release(participant)
        toast({
          title: 'Release',
          description: `Release now`,
          status: 'sucess',
          duration: 4000,
          isClosable: true,
      })
      setTimeout(()=>{
          window.location.reload();
      }, 5000)
      } catch(err) {
        console.log(err)
        setIsLoading(false);
      }
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
        // _hover={{
        //   bgGradient: "linear(to-r, red.400,pink.400)",
        //   boxShadow: "xl",
        // }}
        onClick={actionRelease}
      >
        Release
      </Button>
      <Button
        fontFamily={"heading"}
        mt={8}
        w={"full"}
        bgGradient="linear(to-r, red.400,pink.400)"
        color={"white"}
        // _hover={{
        //   bgGradient: "linear(to-r, red.400,pink.400)",
        //   boxShadow: "xl",
        // }}
        onClick={actionRedeem}
      >
        Redeem
      </Button>
    </Box>
    )

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
                { priceRange && (participantID === 1 || participantID === 2)? <PriceRangeComponent /> : '' }
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

