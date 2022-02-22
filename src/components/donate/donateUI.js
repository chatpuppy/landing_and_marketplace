import React, { useState, useEffect } from "react";

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
} from "@chakra-ui/react";

import {DonateModal} from './donateModal';

import { DateTime } from "luxon";

import { ethers } from "ethers";
import { useAuth } from "contexts/AuthContext";

import donateABI from "abi/TokensVesting_abi";
import { getNameSaleById } from "utils/getNameSaleById";

import { TOKEN_VESTING_ADDRESS } from "constants";

export default function DonateUI() {
  const [isLoading, setIsLoading] = useState(false);
  const { currentAccount, currentNetwork } = useAuth();
  const toast = useToast();
  const id = "toast";

  

  const [totalAmount, setTotal] = useState(0);
  const [releasable, setReleasable] = useState(0);
  const [price, setPrice] = useState(0);
  const [donateData, setDataDonate] = useState();
  const [participantTotal, setTotalParticipant] = useState(0);
  const [participantReleasable, setParticipantReleasable] = useState(0);
  const [participantReleased, setParticipantReleased] = useState(0);
  const [priceRange, setParticipantPriceRange] = useState(0);
  const [allReleasable, setAllReleasable] = useState(0);
  const [participantID, setParticipantID] = useState(0);
  const [donateStatus, setDonationStatus] = useState(false);
  const [donateTX, setDonationTX] = useState();
  const [donateAmount, setDonateAmount] = useState();
  const [priceForAmount, setPriceForAmount] = useState();
  const [beneficiaryCount, setBeneficiaryCount] = useState();
  const [dataCap, setCap] = useState();
  const [userIndex, setUserIndex] = useState();
  const [beneficiaryData, setBeneficiaryData] = useState();

  const getDonateInfo = async (saleID) => {
    if (!window.ethereum || !currentAccount) {
      if (!toast.isActive(id)) {
        toast({
          id,
          title: "No wallet found",
          description: "Please install Metamask",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
      return;
    }

    if (currentNetwork !== 42) {
      if (!toast.isActive(id)) {
        toast({
          id,
          title: "Wrong network",
          description: "Please change network to Kovan Testnet",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
      return;
    }
    setIsLoading(true);
    try {
      const { ethereum } = window; //injected by metamask
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const address = ethers.utils.getAddress(await signer.getAddress());
      const formatAddress = ethers.utils.formatEther(address);

      const participant = saleID;
      const TokenVestingContract = new ethers.Contract(
        TOKEN_VESTING_ADDRESS,
        donateABI,
        signer
      );
      const timestamp = Date.now();

      try {
        console.log(address);
        async function CrowdFundingParams() {
          const response = await TokenVestingContract.crowdFundingParams(
            participant
          );
          setDataDonate(response);
        }

        async function totalAmount() {
          const response = await TokenVestingContract.total();
          setTotal(response);
        }

        async function participantReleasable() {
          const response = await TokenVestingContract.participantReleasable(
            participant
          );
          setParticipantReleasable(response);
        }

        async function totalParticipant() {
          const response =
            await TokenVestingContract.getTotalAmountByParticipant(participant);
          setTotalParticipant(response);
        }

        async function particpantReleased() {
          const response = await TokenVestingContract.participantReleased(
            participant
          );
          setParticipantReleased(response);
        }

        async function participantPriceRange() {
          const response = await TokenVestingContract.priceRange(participant);
          setParticipantPriceRange(response);
        }

        async function getIndex() {
          const response = await TokenVestingContract.getIndex(
            participant,
            formatAddress
          );
          setUserIndex(response);
        }

        async function getBeneficiaryCountParticipant() {
          const response =
            await TokenVestingContract.getBeneficiaryCountParticipant(
              participant
            );
          setBeneficiaryCount(response);
        }

        async function getCap() {
          const response = await TokenVestingContract.getCap(participant);
          setCap(response);
        }

        async function getBeneficiaryData() {
          const response = await TokenVestingContract.getBeneficiary(userIndex);
          setBeneficiaryData(response);
        }

        async function allRleasable() {
          const response = await TokenVestingContract.releasable();
          console.log(response);
          // setReleasable(response)
        }

        // async function donateStatus(){
        //   const status = donateData ? donateData.startTimestamp < timestamp ? false : timestamp > donateData.endTimestamp ? false : true : false
        //   setDonationStatus(status)
        // }

        async function getParticipantID() {
          setParticipantID(participant);
        }

        CrowdFundingParams();
        getParticipantID();
        totalAmount();
        participantReleasable();
        totalParticipant();
        particpantReleased();
        participantPriceRange();
        // donateStatus()
        getBeneficiaryCountParticipant();
        getCap();
        getIndex();
        getBeneficiaryData();
        // allRleasable()
      } catch (err) {
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
   

  const TableDonate = () => {
    const data = donateData;

    const genesisTimestamp = new DateTime(
      ethers.utils.formatEther(data.genesisTimestamp)
    ).toISODate();
    const cliffTimeStamp = new DateTime(
      data.genesisTimestamp + data.cliff
    ).toISODate();
    const tgeAmount = ethers.utils.formatEther(data.tgeAmountRatio.div(100));
    const endDuration = new DateTime(
      data.genesisTimestamp + data.cliff + data.duration
    ).toISODate();
    const eraBasis = ethers.utils.formatEther(data.eraBasis);
    const startTime = new DateTime(data.startTimestamp).toISODate();
    const endTime = new DateTime(data.endTimestamp).toISODate();
    const higest = ethers.utils.formatEther(data.highest);
    const lowest = ethers.utils.formatEther(data.lowest);
    const showCap = ethers.utils.formatEther(dataCap);

    if (data) {
      return (
        <Table variant="simple">
          <Tbody>
            <Tr>
              <Td>Genesis:</Td>
              <Td>{genesisTimestamp}</Td>
            </Tr>
            <Tr>
              <Td>TGE Amount:</Td>
              <Td>{tgeAmount}</Td>
            </Tr>
            <Tr>
              <Td>Cliff:</Td>
              <Td>{`from: ${genesisTimestamp} to ${cliffTimeStamp}`}</Td>
            </Tr>
            <Tr>
              <Td>Duration:</Td>
              <Td>{`from: ${genesisTimestamp} to ${endDuration}`}</Td>
            </Tr>
            <Tr>
              <Td> Era Basis:</Td>
              <Td> {eraBasis}</Td>
            </Tr>
            <Tr>
              <Td> Start:</Td>
              <Td>{startTime}</Td>
            </Tr>
            <Tr>
              <Td> End:</Td>
              <Td>{endTime}</Td>
            </Tr>
            <Tr>
              <Td> Higest:</Td>
              <Td>{higest}</Td>
            </Tr>
            <Tr>
              <Td> Lowest:</Td>
              <Td>{lowest}</Td>
            </Tr>
            <Tr>
              <Td> Allow redeem:</Td>
              <Td>{data.allowRedeem ? "True" : "False"}</Td>
            </Tr>
            <Tr>
              <Td>Accept donation:</Td>
              <Td>{data.acceptOverCap ? "True" : "False"}</Td>
            </Tr>
            <Tr>
              <Td>Price table</Td>
              <Td>
                {/* {isLoading && priceRange ? <PriceRangeTable /> : "..wait"} */}
              </Td>
            </Tr>
            <Tr>
              <Td>Cap:</Td>
              <Td>{showCap}</Td>
            </Tr>
          </Tbody>
        </Table>
      );
    }
  };

  const PriceRangeTable = () => {
    return (
      <Table Table variant="simple">
        <Tbody>
          {priceRange
            ? priceRange.map((range, idx) => (
                <Tr id={idx}>
                  <Td>{ethers.utils.formatEther(range.fromAmount)}</Td>
                  <Td>{ethers.utils.formatEther(range.price)}</Td>
                </Tr>
              ))
            : "0.0"}
        </Tbody>
      </Table>
    );
  };

  const PriceRangeComponent = ({ priceRange }) => {
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

  const Feature = ({ title, desc, onClick, ...rest }) => {
    return (
      <Box
        p={5}
        shadow="md"
        borderWidth="1px"
        flex="1"
        borderRadius="md"
        {...rest}
      >
        <Heading fontSize="xl">{title}</Heading>
        <Text mt={4}>{desc}</Text>
        <Button onClick={onClick}> Donate </Button>
      </Box>
    );
  };

  const CardParticipantType = () => {
    return (
      <Box px={8} py={24} mx="auto">
        <HStack spacing={8}>
          <Feature
            title="Public Sale"
            desc="Public sale Description"
            onClick={() => getDonateInfo(2)}
          />
          <Feature
            title="Private Sale"
            desc="Description"
            onClick={() => getDonateInfo(1)}
          />
        </HStack>
      </Box>
    );
  };

  const ParticipantUI = (participant) => (
    <Stack
      spacing={{
        base: "8",
        lg: "6",
      }}
    >
      {console.log("ParticipantUI:", participantID)}
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
        <Heading>{participant ? getNameSaleById(participantID) : ""}</Heading>
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
            <Text lignItems={'center'} justifyContent={'center'} m={5} fontSize='2xl'>Beneficiary: {ethers.utils.formatEther(beneficiaryCount)}</Text>
          </Card>
          <Card>
            {/* { isLoading && priceRange ? <PriceRangeComponent priceRange={priceRange} /> : '' } */}
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
            <TableDonate />
          </Card>
          <Card>
            <InputDonate />
          </Card>
        </SimpleGrid>
      </Card>
    </Stack>
  );

  return (
    <>
      {participantID === 0 ? (
        <CardParticipantType />
      ) : participantID > 0 && donateData && isLoading ? (
        <ParticipantUI participant={participantID} />
      ) : (
        <Stack
          spacing={{
            base: "8",
            lg: "6",
          }}
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            alignItems="center"
            alignContent="center"
            size="xl"
          />
        </Stack>
      )}
    </>
  );
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
        justifyContet={"center"}
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

export const Blur = (props) => {
  return (
    <Icon
      width={useBreakpointValue({ base: "100%", md: "40vw", lg: "30vw" })}
      zIndex="-1"
      height="560px"
      viewBox="0 0 528 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="71" cy="61" r="111" fill="#F56565" />
      <circle cx="244" cy="106" r="139" fill="#ED64A6" />
      <circle cy="291" r="139" fill="#ED64A6" />
      <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" />
      <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" />
      <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
      <circle cx="426.5" cy="-0.5" r="101.5" fill="#4299E1" />
    </Icon>
  );
};

const Card = (props) => (
  <Box
    minH="36"
    bg="gray.100"
    boxShadow={useColorModeValue("gray.800", "inherit")}
    borderRadius="lg"
    {...props}
  />
);
