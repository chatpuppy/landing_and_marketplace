import { ethers } from "ethers";

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
    Tabs
  } from '@chakra-ui/react'

import DonateModal from './donateModal';
import { Card } from '../common/Card';
import { Blur } from '../common/Blur';

import { useDonate } from "contexts/DonateContext";
import { getNameSaleById } from "utils/getNameSaleById";

import { InfoTableComponent } from "./infoTableComponet";


export const DonateView = () => {
    const { participantID, totalAmount, beneficiaryCount, priceRange } = useDonate()
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
                <InfoTableComponent />
              </Card>
              <Card>
                <InputDonate />
              </Card>
            </SimpleGrid>
         </Card>
        </Stack>
      )
}
    

  const InputDonate = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
  
    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
      useNumberInput({
        step: 0.01,
        defaultValue: 1.0,
        min: 1,
        max: 6,
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
          mt={10}
          mr={10}
          borderRight={20}
        >
          <Heading mb={10}>Donate</Heading>
          <HStack maxW="320px">
            <Button {...inc}>+</Button>
            <Input {...input} />
            <Button {...dec}>-</Button>
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
        <Blur
          position={"absolute"}
          top={-10}
          left={-10}
          style={{ filter: "blur(70px)" }}
        />
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
    const {priceRange } = useDonate()
    if (priceRange) {
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
          <Heading fontSize="xl" align="center">
            Price Range
          </Heading>
          <List>
            {priceRange
              ? priceRange.map((range, idx) => (
                  <li id={idx}>
                    {" "}
                    <ListItem>
                      <Text align="left" fontSize="lg">
                        {ethers.utils.formatEther(range.fromAmount)} for:{" "}
                        {ethers.utils.formatEther(range.price)}{" "}
                      </Text>
                    </ListItem>
                  </li>
                ))
              : "0.0"}
          </List>
        </Box>
      );
    }
  };
  

  