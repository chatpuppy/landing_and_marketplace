import { ethers } from "ethers";
import React, {useEffect, useState} from "react";

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
    Spinner,
    Input,
    InputGroup,
    InputRightElement,
    List,
    ListIcon,
    ListItem,
    Table,
    Tbody,
    Tr,
    Td,
    NumberInput,
    useNumberInput,
    Container,
    Icon,
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    TabPanels,
    Tab, 
    TabPanel,
    TabList,
    Tabs,
    Thead,
    Tfoot,
    Th,
    TableCaption,
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

export const DonateView = () => {
    const { participantID, beneficiaryCount, beneficiaryData, releasable, donateData, participantTotal } = useDonate();
    const [ isLoading, setIsLoading ] = useState(false);
    const toast = useToast()
    // console.log("beneficiaryData", beneficiaryData);

    const release = async () => {
      setIsLoading(true);
      try {
        const { ethereum } = window; //injected by metamask
        const provider = new ethers.providers.Web3Provider(ethereum); 
        const signer = provider.getSigner(); 
        // const options = {value: ethers.utils.parseEther((amount).toString())}
        const TokenVestingContract = new ethers.Contract(TOKEN_VESTING_ADDRESS, donateABI, signer);
        
        let uint8 = new Uint8Array(2);
        uint8[0] = participantID;

        try {
            await TokenVestingContract.release(uint8[0], {})
            toast({
                title: 'Release',
                description: `Release releasable tokens`,
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
      } catch(err) {
          console.log('Error Release', err)
      }
    }

    const redeem = async () => {
      setIsLoading(true);
      try {
        const { ethereum } = window; //injected by metamask
        const provider = new ethers.providers.Web3Provider(ethereum); 
        const signer = provider.getSigner(); 
        const TokenVestingContract = new ethers.Contract(TOKEN_VESTING_ADDRESS, donateABI, signer);
        
        let uint8 = new Uint8Array(2);
        uint8[0] = participantID;

        try {
            await TokenVestingContract.redeem(uint8[0], {})
            toast({
                title: 'Redeem',
                description: `Redeem unreleasable tokens`,
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
      } catch(err) {
          console.log('Error redeem', err)
      }
    }

    const format = (num) => {
      return parseFloat(num).toFixed(3).toString();
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
              <Text fontSize={'2xl'} color={useColorModeValue("gray.400", "#3d444f")} mt={5} mb={5}>{'sold ' + format(ethers.utils.formatEther(participantTotal))}</Text>
            </Card>
    
            <Card textAlign={'center'} justifyContent={'center'}>
              <Heading alignItems={'center'} justifyContent={'center'} m={5} fontSize='2xl'>Released</Heading>
              <Text fontSize={'4xl'}>{format(ethers.utils.formatEther(beneficiaryData === undefined ? 0 : beneficiaryData.releasedAmount))}</Text>
              {beneficiaryData === undefined ? "" : <Button mt={5} mb={5} onClick={redeem}>Redeem unreleased</Button>}
            </Card>
            
            <Card textAlign={'center'} justifyContent={'center'}>
              <Heading alignItems={'center'} justifyContent={'center'} m={5} fontSize='2xl'>Releaseble</Heading>
              <Text mt={-10} ml={10}>{beneficiaryData === undefined ? <AiTwotoneCheckCircle color={"gray"}/> : beneficiaryData.status === 1 ? <AiTwotoneCheckCircle color={"green"}/> : <AiTwotoneCheckCircle color={"red"}/>}</Text>
              <Text mt={5} fontSize={'4xl'}>{format(ethers.utils.formatEther(releasable === undefined ? 0 : releasable))}</Text>
              {releasable > 0 ? <Button mt={5} mb={5} onClick={release}>Release</Button> : ''} 
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
        step: 0.001, 
        defaultValue: 0.05, // ###### 测试时使用小一点的数
        min: 0.04,
        max: 0.06,
        precision: 3,
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
            _hover={{
              bgGradient: "linear(to-r, red.400,pink.400)",
              boxShadow: "xl",
            }}
            onClick={onOpen}
          >
            Donate
          </Button>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
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
                    <Td>{ethers.utils.formatEther(range.fromAmount)} CPT</Td>
                    {/* <Td>{ethers.utils.formatEther(range.toAmount)} CPT</Td> */}
                    <Td>{range.price.toString()} CPT/BNB</Td>
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
  

