// import React, { useState, useEffect, useCallback } from "react";

// import {
//   Box,
//   Button,
//   Heading,
//   SimpleGrid,
//   Stack,
//   Text,
//   useBreakpointValue,
//   useColorModeValue,
//   useToast,
//   HStack,
//   Spinner,
//   Input,
//   InputGroup,
//   InputRightElement,
//   List,
//   ListIcon,
//   ListItem,
//   Table,
//   Tbody,
//   Tr,
//   Td
//   } from '@chakra-ui/react'

// import { TOKEN_VESTING_ADDRESS } from "constants";
// import donateABI from "abi/TokensVesting_abi";

// import { ethers } from "ethers";
// import { useAuth } from "contexts/AuthContext";
// import { DateTime } from "luxon";

// export default function DonatedUI() {
//     const [isLoading, setIsLoading] = useState(false);
//     const { currentAccount, currentNetwork } = useAuth();
//     const toast = useToast();
//     const id = "toast";
    
//     const [userIndex, setUserIndex] = useState();
//     const [beneficiaryData, setBeneficiaryData] = useState();
//     const [userIndexHash, setUserIndexHash] = useState();


//     const getBeneficiary = useCallback(async() => {
//       if (!window.ethereum || !currentAccount) {
//         if (!toast.isActive(id)) {
//           toast({
//             id,
//             title: "No wallet found",
//             description: "Please install Metamask",
//             status: "error",
//             duration: 4000,
//             isClosable: true,
//           });
//         }
//         return;
//       }
  
//       if (currentNetwork !== 42) {
//         if (!toast.isActive(id)) {
//           toast({
//             id,
//             title: "Wrong network",
//             description: "Please change network to Kovan Testnet",
//             status: "error",
//             duration: 4000,
//             isClosable: true,
//           });
//         }
//         return;
//       }
//       setIsLoading(true);

//       try {
//         const { ethereum } = window; //injected by metamask
//         const provider = new ethers.providers.Web3Provider(ethereum);
//         const signer = provider.getSigner();
//         const address = await signer.getAddress();
//         const participant = particpantID;
//         const TokenVestingContract = new ethers.Contract(
//           TOKEN_VESTING_ADDRESS,
//           donateABI,
//           signer
//         );

//         try {
    

//           async function getIndex() {
//             const response = await TokenVestingContract.getIndex(
//               participant,
//               address
//             );
//             setUserIndexHash(response[0]);
//             setUserIndex(response[1]);
//           }

//           async function getBeneficiaryData() {
//             const response = await TokenVestingContract.getBeneficiary(userIndex);
//             setBeneficiaryData(response);
//           }

//           getIndex();
//           getBeneficiaryData();

//         } catch (err) {
//           setIsLoading(false);
//         }

//       } catch (err) {
//         console.log(err);
//       }

//     }, [currentAccount, currentNetwork, particpantID, toast, userIndex])

//     return (
//       <Stack
//       spacing={{
//         base: "8",
//         lg: "6",
//       }}
//     >
//       <Stack
//         spacing="4"
//         direction={{
//           base: "column",
//           lg: "row",
//         }}
//         justify="space-between"
//       >
//         <Stack spacing="1">
//           <Heading
//             size={useBreakpointValue({
//               base: "xs",
//               lg: "sm",
//             })}
//             fontWeight="medium"
//           ></Heading>
//         </Stack>
//       </Stack>
//       <Stack>
//         {/* <Heading>Donated on {participantID ? getNameSaleById(participantID) : ""}</Heading> */}
//       </Stack>
//       <Stack
//         spacing={{
//           base: "5",
//           lg: "6",
//         }}
//       >
//         <SimpleGrid
//           columns={{
//             base: 1,
//             md: 3,
//           }}
//           gap="6"
//         >
//           <Card>
//             {/* <Text alignItems={'center'} justifyContent={'center'} m={5} fontSize='2xl'>Total: {ethers.utils.formatEther(totalAmount)}</Text> */}
//           </Card>
  
//           <Card>
//             {/* <Text alignItems={'center'} justifyContent={'center'} m={5} fontSize='2xl'>Beneficiary: {ethers.utils.formatEther(beneficiaryCount)}</Text> */}
//           </Card>
//           <Card>
           
//           </Card>
//         </SimpleGrid>
//       </Stack>
//       <Stack>
//         <SimpleGrid
//           columns={{
//             base: 1,
//             md: 3,
//           }}
//           gap="6"
//         ></SimpleGrid>
//       </Stack>
//       <Card minH="xs">
//         <SimpleGrid columns={2} spacing={10}>
//           <Card>
//             <TableDonated />
//           </Card>
//           <Card>
//              <DonatedButtons />
//           </Card>
//         </SimpleGrid>
//       </Card>
//     </Stack>
//     )
// }

// const DonatedButtons = () => (
//   <Box
//   justifyContent={"center"}
//   textAlign={"center"}
//   as={"form"}
//   mt={10}
//   mr={10}
//   borderRight={20}
// >
//   <Button
//     fontFamily={"heading"}
//     mt={8}
//     w={"full"}
//     bgGradient="linear(to-r, red.400,pink.400)"
//     color={"white"}
//     _hover={{
//       bgGradient: "linear(to-r, red.400,pink.400)",
//       boxShadow: "xl",
//     }}
//     onClick={() => console.log('release')}
//   >
//     Release
//   </Button>
//   <Button
//     fontFamily={"heading"}
//     mt={8}
//     w={"full"}
//     bgGradient="linear(to-r, red.400,pink.400)"
//     color={"white"}
//     _hover={{
//       bgGradient: "linear(to-r, red.400,pink.400)",
//       boxShadow: "xl",
//     }}
//     onClick={() => console.log('Reedeem')}
//   >
//     Reedeem
//   </Button>
// </Box>
// )

// const Card = (props) => (
//   <Box
//     minH="36"
//     bg="gray.100"
//     boxShadow={useColorModeValue("gray.800", "inherit")}
//     borderRadius="lg"
//     {...props}
//   />
// );

// const TableDonated = (data, dataCap) => {
//   console.log("TableDonate:", data)

//   const genesisTimestamp = new DateTime(
//     ethers.utils.formatEther(data.genesisTimestamp)
//   ).toISODate();
//   const cliffTimeStamp = new DateTime(
//     data.genesisTimestamp + data.cliff
//   ).toISODate();
//   const tgeAmount = ethers.utils.formatEther(data.tgeAmountRatio.div(100));
//   const endDuration = new DateTime(
//     data.genesisTimestamp + data.cliff + data.duration
//   ).toISODate();
//   const eraBasis = ethers.utils.formatEther(data.eraBasis);
//   const startTime = new DateTime(data.startTimestamp).toISODate();
//   const endTime = new DateTime(data.endTimestamp).toISODate();
//   const higest = ethers.utils.formatEther(data.highest);
//   const lowest = ethers.utils.formatEther(data.lowest);
//   const showCap = ethers.utils.formatEther(dataCap);

//   return (
//     <Table variant="simple">
//       <Tbody>
//         <Tr>
//           <Td>Genesis:</Td>
//           {/* <Td>{genesisTimestamp}</Td> */}
//         </Tr>
//         <Tr>
//           <Td>TGE Amount:</Td>
//           {/* <Td>{tgeAmount}</Td> */}
//         </Tr>
//         <Tr>
//           <Td>Cliff:</Td>
//           {/* <Td>{`from: ${genesisTimestamp} to ${cliffTimeStamp}`}</Td> */}
//         </Tr>
//         <Tr>
//           <Td>Duration:</Td>
//           {/* <Td>{`from: ${genesisTimestamp} to ${endDuration}`}</Td> */}
//         </Tr>
//         <Tr>
//           <Td> Era Basis:</Td>
//           {/* <Td> {eraBasis}</Td> */}
//         </Tr>
//         <Tr>
//           <Td> Start:</Td>
//           {/* <Td>{startTime}</Td> */}
//         </Tr>
//         <Tr>
//           <Td> End:</Td>
//           {/* <Td>{endTime}</Td> */}
//         </Tr>
//         <Tr>
//           <Td> Higest:</Td>
//           {/* <Td>{higest}</Td> */}
//         </Tr>
//         <Tr>
//           <Td> Lowest:</Td>
//           {/* <Td>{lowest}</Td> */}
//         </Tr>
//         <Tr>
//           <Td> Allow redeem:</Td>
//           {/* <Td>{data.allowRedeem ? "True" : "False"}</Td> */}
//         </Tr>
//         <Tr>
//           <Td>Accept donation:</Td>
//           {/* <Td>{data.acceptOverCap ? "True" : "False"}</Td> */}
//         </Tr>
//         <Tr>
//           <Td>Cap:</Td>
//           {/* <Td>{showCap}</Td> */}
//         </Tr>
//       </Tbody>
//     </Table>
//   )
// };