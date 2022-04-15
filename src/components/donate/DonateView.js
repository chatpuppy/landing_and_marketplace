import { ethers } from "ethers";
import React, { useState} from "react";

import {
    Stack,
    Heading,
    SimpleGrid,
    Box,
    Button,
    Text,
    useBreakpointValue,
    useColorModeValue,
    useToast,
    HStack,
    Input,
    Table,
    Tbody,
    Tr,
    Td,
    useNumberInput,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Thead,
    Th,
  } from '@chakra-ui/react'

import DonateModal from './donateModal';
import { Card } from '../common/Card';
import { Blur } from '../common/Blur';

import { useDonate } from "contexts/DonateContext";
import { getNameSaleById } from "utils/getNameSaleById";

import { InfoTableComponent } from "./infoTableComponet";
import donateABI from "abi/TokensVesting_abi";
import { TOKEN_VESTING_ADDRESS } from "constants";
import { AiTwotoneCheckCircle } from "react-icons/ai";
const formatThousands = require('format-thousands');

export const DonateView = () => {
    const { participantID, beneficiaryData, releasable, donateData, participantTotal } = useDonate();
    const [ isReleasing, setIsReleasing ] = useState(false);
    const [ isRedeeming, setIsRedeeming ] = useState(false);
    const [ showRedeemButton, setShowRedeemButton ] = useState(true);
    const toast = useToast()
    const { ethereum } = window; //injected by metamask
    const provider = new ethers.providers.Web3Provider(ethereum); 
    const signer = provider.getSigner(); 
    // const options = {value: ethers.utils.parseEther((amount).toString())}
    const TokenVestingContract = new ethers.Contract(TOKEN_VESTING_ADDRESS, donateABI, signer);

    const release = async () => {
      setIsReleasing(true);
      try {
        let uint8 = new Uint8Array(2);
        uint8[0] = participantID;

        try {
          const tx = await TokenVestingContract.release(uint8[0], {})
          toast({
              title: 'Release',
              description: `Waiting for confirmation, hash: ${tx.hash}`,
              status: 'warning',
              duration: 4000,
              isClosable: true,
          })

          await tx.wait(2);
          setIsReleasing(false);
          window.location.reload();
        } catch(err) {
            console.log(err)
            toast({
              title: 'Release tokens error',
              description: `${err.data.message}`,
              status: 'error',
              duration: 4000,
              isClosable: true,
            })
            setIsReleasing(false);
        }
      } catch(err) {
          console.log('Error Release', err)
      }
    }

    const redeem = async () => {
      setIsRedeeming(true);
      try {        
        let uint8 = new Uint8Array(2);
        uint8[0] = participantID;

        try {
            const tx = await TokenVestingContract.redeem(uint8[0], {})
            toast({
              title: 'Redeem',
              description: `Waiting for confirmation, hash: ${tx.hash}`,
              status: 'warning',
              duration: 4000,
              isClosable: true,
            });
            await tx.wait(2);
            setIsRedeeming(false);
            setShowRedeemButton(false);
        } catch(err) {
            console.log(err)
            toast({
              title: 'Redeem error',
              description: `${err.data.message}`,
              status: 'error',
              duration: 4000,
              isClosable: true,
            })
            setIsRedeeming(false);
        }
      } catch(err) {
          console.log('Error redeem', err)
          setIsRedeeming(false);
      }
    }

    const format = (num) => {
			return formatThousands(parseFloat(num).toFixed(0).toString(), {separator: ','});
		}

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
          <Heading>{participantID ? getNameSaleById(participantID) : ""}</Heading>
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
            <Card textAlign={'center'} justifyContent={'center'}>
              <Heading alignItems={'center'} justifyContent={'center'} m={5} fontSize='2xl'>Your benefit</Heading>
              <Text fontSize={'4xl'}>{format(ethers.utils.formatEther(beneficiaryData === undefined ? 0 : beneficiaryData.totalAmount))}</Text>
              <Text fontSize={'2xl'} color={useColorModeValue("gray.400", "#3d444f")} mt={5} mb={5}>{'Sold ' + format(ethers.utils.formatEther(participantTotal))}</Text>
            </Card>
    
            <Card textAlign={'center'} justifyContent={'center'}>
              <Heading alignItems={'center'} justifyContent={'center'} m={5} fontSize='2xl'>Released</Heading>
              <Text fontSize={'4xl'}>{format(ethers.utils.formatEther(beneficiaryData === undefined ? 0 : beneficiaryData.releasedAmount))}</Text>
              {beneficiaryData === undefined || beneficiaryData.totalAmount.eq(beneficiaryData.releasedAmount) || !showRedeemButton ? "" : <Button mt={5} mb={5} onClick={redeem} isLoading={isRedeeming}>Redeem unreleased</Button>}
            </Card>
            
            <Card textAlign={'center'} justifyContent={'center'}>
              <Heading alignItems={'center'} justifyContent={'center'} m={5} fontSize='2xl'>Releaseble</Heading>
              <Text mt={-10} ml={10}>{beneficiaryData === undefined ? <AiTwotoneCheckCircle color={"gray"}/> : beneficiaryData.status === 1 ? <AiTwotoneCheckCircle color={"green"}/> : <AiTwotoneCheckCircle color={"red"}/>}</Text>
              <Text mt={5} fontSize={'4xl'}>{format(ethers.utils.formatEther(releasable === undefined ? 0 : releasable))}</Text>
              {releasable > 0 ? <Button mt={5} mb={5} onClick={release} isLoading={isReleasing}>Release</Button> : ''} 
            </Card>
          </SimpleGrid>
        </Stack>
        <Blur
          position={"absolute"}
          top={-10}
          left={-10}
          style={{ filter: "blur(70px)" }}
        />
        {participantID === 1 || participantID === 2 ? 
        <Box>
        <Stack textAlign={'center'} justifyContent={'center'}>
          <SimpleGrid >
            <Card textAlign={'center'} justifyContent={'center'}>
            <PriceRangeComponent/>
            </Card>
          </SimpleGrid>
        </Stack>
        <Card minH="xs">
          <SimpleGrid columns={1} spacing={10}>
            <Card>
              <InfoTableComponent />
            </Card>
            {beneficiaryData !== undefined || donateData.endTimestamp * 1000 < new Date().getTime() ? "" : 
            <Card>
              <InputDonate />
            </Card>
            }
          </SimpleGrid>
        </Card>
        </Box> : ""}
        <Box height={5}></Box>
      </Stack>
    )
}
    

  const InputDonate = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
  
    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
      useNumberInput({
        step: 0.01, 
        defaultValue: 0.5,
        min: 0.3,
        max: 0.5,
        precision: 2,
      });
  
    const inc = getIncrementButtonProps();
    const dec = getDecrementButtonProps();
    const input = getInputProps({ isReadOnly: true });
  
    return (
      <>
        <Box
          justifyContent={"center"}
          textAlign={"center"}
          as={"form"}
          mt={5}
          ml={20}
          mr={20}
          borderRight={20}
          mb={10}
        >
          <Heading mb={10}>Donate</Heading>
          <HStack maxW="full">
            <Button {...dec}>-</Button>
            <Input {...input} />
            <Button {...inc}>+</Button>
          </HStack>
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
            onClick={onOpen}
          >
            Donate
          </Button>
        </Box>
        <Modal 
          isOpen={isOpen} 
          onClose={onClose} 
          closeOnOverlayClick={false}
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirmation</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <DonateModal amount={input.value} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  };


  const PriceRangeComponent = () => {
    const { priceRange } = useDonate()

    // if (priceRange) {
      return (
        <Box
          margin={{
            base: "20px",
            lg: "10px",
          }}
          direction={{
            base: "column",
            lg: "row",
          }}
        >
          <Heading fontSize="2xl" align="left" ml={12} mb={5} mt={5} color={useColorModeValue('black.700', '#dcdcdc')}>
            Rate list
          </Heading>
          <Table ml={"5%"} mr={"5%"} width={"90%"} mb={8} variant="simple" color={useColorModeValue('black.700', '#dcdcdc')}>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>From</Th>
                {/* <Th> to</Th> */}
                <Th> rate</Th>
              </Tr>
            </Thead>
            <Tbody>
            {priceRange
              ? priceRange.map((range, idx) => (
                <Tr key={idx}>
                    <Td>{idx+1}</Td>
                    <Td>{formatThousands(ethers.utils.formatEther(range.fromAmount), {separator: ','})} CPT</Td>
                    {/* <Td>{ethers.utils.formatEther(range.toAmount)} CPT</Td> */}
                    <Td>{formatThousands(range.price.toString(), {separator: ','})} CPT/BNB</Td>
                    {/* <Td>{dataCap ? dataCap  : '...'} CPT/BNB</Td> */}
                  </Tr>
                ))
              : "..."}
            </Tbody>
          </Table>
        </Box>
      );
    // }
  };
  

