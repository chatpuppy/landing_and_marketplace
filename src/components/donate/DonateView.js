import React, { useState, useEffect} from "react";
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
	Progress
} from '@chakra-ui/react'

import { ethers } from "ethers";
import DonateModal from './donateModal';
import { Card } from '../common/Card';
import { Blur } from '../common/Blur';

import { useDonate } from "contexts/DonateContext";
import { getNameSaleById } from "utils/getNameSaleById";

import { InfoTableComponent } from "./infoTableComponet";
import donateABI from "abi/TokensVesting_abi";
import { TOKEN_VESTING_ADDRESS } from "constants";
import Countdown from '../common/Countdown';
import { AiTwotoneCheckCircle } from "react-icons/ai";
import { getGlobalTime } from "../common/Worldtime";
import { useAuth } from 'contexts/AuthContext';
import { DateTime } from "luxon";

export const DonateView = () => {
	const formatThousands = require('format-thousands');
	const { 
		participantID, 
		priceRange, 
		beneficiaryData, 
		setBeneficiaryData, 
		releasable, 
		setReleasable, 
		donateData, 
		participantTotal,
		priceForAmount,
		redeemable
	} = useDonate();
	const [ isLoading, setIsLoading ] = useState(false);
	const [ isDisabled, setIsDisabled ] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [ showRedeemButton, setShowRedeemButton ] = useState(false);
	const [ showReleaseButton, setShowReleaseButton ] = useState(false);
	const [ showDonateButton, setShowDonateButton ] = useState(false);
	const { currentAccount } = useAuth()
	const [ modalOptions, setModalOptions ] = useState({
		message: '', 
		buttonName: 'Claim', 
		fun: "release",
	});
	const [ countdownOptions, setCountdownOptions ] = useState({
		circleColor: "",
		title: "",
		timeTillDate: 0,
	});
	const [progressRate, setProgressRate] = useState({sold: 0, total: 100, rate: 0});
	const [donationPrice, setDonationPrice] = useState({index: 0, price: 0});

	const toast = useToast()
	
	const { ethereum } = window; //injected by metamask
	const provider = new ethers.providers.Web3Provider(ethereum); 
	const signer = provider.getSigner(); 
	const TokenVestingContract = new ethers.Contract(TOKEN_VESTING_ADDRESS, donateABI, signer);
	
	const release = async () => {
		setIsLoading(true);
		try {
			let uint8 = new Uint8Array(2);
			uint8[0] = participantID;

			try {
				const tx = await TokenVestingContract.release(uint8[0], {})
				toast({
						title: 'Claim',
						description: `Waiting for confirmation, hash: ${tx.hash}`,
						status: 'warning',
						duration: 4000,
						isClosable: true,
				})

				await tx.wait(2);
				toast({
					title: 'Claim',
					description: `Claim successfully, you can claim every one minute.`,
					status: 'success',
					duration: 4000,
					isClosable: true,
				})
				setReleasable(0);
				setShowReleaseButton(false);
				setBeneficiaryData({
					...beneficiaryData,
					releasedAmount: beneficiaryData.releasedAmount.add(releasable),
				})
				setIsLoading(false);
				setIsDisabled(true);
				onClose();
			} catch(err) {
					console.log(err)
					toast({
						title: 'Claim error',
						description: `${err.data.message}`,
						status: 'error',
						duration: 4000,
						isClosable: true,
					})
					setIsLoading(false);
			}
		} catch(err) {
				console.log('Error Claim', err)
		}
	}

	const redeem = async () => {
		setIsLoading(true);
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
					toast({
						title: 'Redeem',
						description: `Redeem successfully.`,
						status: 'success',
						duration: 4000,
						isClosable: true,
					})
					setShowRedeemButton(false);
					setIsLoading(false);
					setIsDisabled(true);
					onClose();
				} catch(err) {
					console.log(err)
					toast({
						title: 'Redeem error',
						description: `${err.data.message}`,
						status: 'error',
						duration: 4000,
						isClosable: true,
					})
					setIsLoading(false);
			}
		} catch(err) {
				console.log('Error redeem', err)
				setIsLoading(false);
		}
	}

	const format = (num) => {
		return formatThousands(parseFloat(num).toFixed(0).toString(), {separator: ','});
	}
	
	useEffect(() => {
		const initCountdownOptions = async () => {
			await countdownData();
		};
		const countdownData = async() => {
			// Get phrase no, phrase name and timeTillDate
			if(donateData === undefined) return;
			const current = await getGlobalTime();
			const donateStart = parseInt(donateData.startTimestamp);
			const donateEnd = parseInt(donateData.endTimestamp);
			const genesisStart = parseInt(donateData.genesisTimestamp);
			const cliffEnd = parseInt(donateData.genesisTimestamp) + parseInt(donateData.cliff);
			const releaseEnd = parseInt(donateData.genesisTimestamp) + parseInt(donateData.cliff) + parseInt(donateData.duration);


			if(current < donateStart) setCountdownOptions({
				circleColor: "#E53E3E",
				title: "Time to start donating",
				timeTillDate: donateStart
			});
			else if(current < donateEnd) setCountdownOptions({
				circleColor: "#48BB78",
				title: "Time to donation end",
				timeTillDate: donateEnd,
			});
			else if(current < genesisStart) setCountdownOptions({
				circleColor: "#E53E3E",
				title: "Time to genesis start",
				timeTillDate: genesisStart,
			});
			else if(current < cliffEnd) setCountdownOptions({
				circleColor: "#E53E3E",
				title: "Time to cliff end and start to claim",
				timeTillDate: cliffEnd,
			});
			else if(current < releaseEnd) setCountdownOptions({
				circleColor: "#48BB78",
				title: "Time to releasing end",
				timeTillDate: releaseEnd,
			});
			else setCountdownOptions({
				circleColor: "",
				title: "",
				timeTillDate: 0
			})
		}
		initCountdownOptions();
	}, [donateData, priceRange, currentAccount])

	useEffect(() => {
		if(redeemable !== undefined) setShowRedeemButton(redeemable[0]);
		const setReleaseButton = async () => {
			const timestamp = await getGlobalTime();
			const donateStart = parseInt(donateData.startTimestamp);
			const donateEnd = parseInt(donateData.endTimestamp);
			const releaseStart = parseInt(donateData.genesisTimestamp);
			const releaseEnd = parseInt(donateData.genesisTimestamp) + parseInt(donateData.cliff) + parseInt(donateData.duration);
			if(timestamp >= releaseStart && timestamp <= releaseEnd) setShowReleaseButton(true);
			if(timestamp >= donateStart && timestamp <= donateEnd) setShowDonateButton(true);
		}
		if(donateData !== undefined) setReleaseButton();
	}, [donateData, currentAccount, redeemable])

	useEffect(() => {
		const initPriceForAmount = () => {
			setDonationPrice({index: priceForAmount[1], price: priceForAmount[0]});
		}
		if(priceForAmount !== undefined) initPriceForAmount();
	}, [priceForAmount, currentAccount])
	
	useEffect(() => {
		if(participantTotal === undefined	
			|| priceRange === undefined 
			|| priceRange.length === 0 
			|| priceRange[priceRange.length - 1] === undefined
		) return;
		// console.log('===', participantID, participantTotal.toString())
		setProgressRate({
			sold: participantTotal, 
			total: priceRange[priceRange.length - 1].fromAmount,
			rate: participantTotal / priceRange[priceRange.length - 1].fromAmount * 100
		});
	}, [participantTotal, priceRange, currentAccount, participantID])

	const col = useColorModeValue("black", "white");
	const textColor = useColorModeValue("gray.400", "gray.600");

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

			{countdownOptions.timeTillDate === 0 ? <></> : 
			<Card
				textAlign={'center'} 
				justifyContent={'center'}
				w={"full"}
				p={5}
			>
				<Countdown 
					title={countdownOptions.title}
					timeTillDate={countdownOptions.timeTillDate}
					circleColor={countdownOptions.circleColor}
					fontColor={col}
					labelColor={col}
				/>
			</Card>}

			<Card
				textAlign={'center'}
				justifyContent={'center'}
				w={"full"}
				p={5}
			>
				<Box
					letterSpacing={'2px'}
					fontSize={"md"}
					fontWeight={600}
					pb={3}
					textTransform={"uppercase"}
				>progress</Box>
				<Progress
					w={"80%"}
					ml={"10%"}
					backgroundColor={useColorModeValue("gray.200", "gray.800")}
					value={progressRate.rate}
					colorScheme='green'
				/>
				<Box
					letterSpacing={'2px'}
					fontSize={"md"}
					mt={5}
				>{format(ethers.utils.formatEther(progressRate.sold)) + " CPT / " + format(ethers.utils.formatEther(progressRate.total)) + " CPT = " + progressRate.rate.toFixed(4) + "%"}</Box>
				<Box
					letterSpacing={'2px'}
					fontSize={"md"}
					mt={5}
					textTransform={"uppercase"}
				>{`Current Rate: ${format(donationPrice.price)} CPT/BNB`}</Box>
			</Card>

			<Stack
				spacing={{
					base: "5",
					lg: "6",
				}}
			>
				<SimpleGrid
					columns={{
						base: 1,
						md: 2,
					}}
					gap="6"
				>
					<Card textAlign={'center'} justifyContent={'center'}>
						<Heading alignItems={'center'} justifyContent={'center'} m={5} fontSize='md' letterSpacing='2px' textTransform='uppercase'>YOUR BENEFIT (CPT)</Heading>
						<Text fontSize={'3xl'}>{format(ethers.utils.formatEther(beneficiaryData === undefined ? 0 : beneficiaryData.totalAmount))}</Text>
						{beneficiaryData === undefined ? 
							showDonateButton ? 
							<InputDonate/> :
							<></>
							: 
							<Text fontSize={'md'} color={textColor} mt={2} mb={1} ml={"5%"} mr={"5%"}>
							{"Donated " + ethers.utils.formatEther((beneficiaryData.totalAmount).div(beneficiaryData.price)) + " BNB x " + format(beneficiaryData.price) + " CPT/BNB"}
							</Text>}
						<Text fontSize={'md'} color={textColor} mt={2} mb={4} ml={"5%"} mr={"5%"}>
							{(beneficiaryData === undefined ? '' : "at " + DateTime.fromSeconds(parseInt(beneficiaryData.timestamp)).toFormat('F'))}</Text>
						{beneficiaryData === undefined || beneficiaryData.totalAmount.eq(beneficiaryData.releasedAmount) || !showRedeemButton ? <></> : 
						<Button 
							mb={5} 
							bg={"green.500"}
							_hover={{bg: 'green.600'}}
							_active={{bg: 'green.600'}}
							onClick={() => {
							setModalOptions({
								message: `Do you want to redeem the unreleased tokens? After redeemed, you will be refund the balance BNBs, and can not claim any CPTs.`,
								buttonName: 'Redeem',
								fun: "redeem",
							})
							onOpen();
						}}>
							Redeem
						</Button>}
					</Card>
					
					<Card textAlign={'center'} justifyContent={'center'}>
						<Heading alignItems={'center'} justifyContent={'center'} mt={5} fontSize='md' letterSpacing='2px' textTransform='uppercase'>Claimed (CPT)</Heading>
						<Text mt={-3} ml={8}>{beneficiaryData === undefined ? <AiTwotoneCheckCircle color={"gray"}/> : beneficiaryData.status === 1 ? <AiTwotoneCheckCircle color={"#48BB78"}/> : <AiTwotoneCheckCircle color={"#E53E3E"}/>}</Text>
						
						<Text mt={2} fontSize={'3xl'}>{format(ethers.utils.formatEther(beneficiaryData === undefined ? 0 : beneficiaryData.releasedAmount))}</Text>
						<Heading alignItems={'center'} justifyContent={'center'} m={3} fontSize='md' letterSpacing='2px' textTransform='uppercase'>claimable (CPT)</Heading>
						<Text mt={0} mb={2} fontSize={'3xl'}>{format(ethers.utils.formatEther(releasable === undefined ? 0 : releasable))}</Text>

						{releasable > 0 && showReleaseButton ? 
						<Button 
							mb={5} 
							bg={"green.500"}
							_hover={{bg: 'green.600'}}
							_active={{bg: 'green.600'}}
							onClick={() => {
							setModalOptions({
								message:`Do you want to claim ${format(ethers.utils.formatEther(releasable === undefined ? 0 : releasable))} CPT?`, 
								buttonName: 'Claim', 
								fun: "release", 
							}); 
							onOpen();
						}}>Claim
						</Button> : ''}
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

			<Card>
				<InfoTableComponent />
			</Card>
			{donateData === undefined ? <></> :
			donateData.endTimestamp * 1000 < (new Date()).getTime() ? 
			<Card>
				<DonotedBox message={"Donation is end!"}/>					
			</Card> : (new Date()).getTime() < donateData.startTimestamp * 1000 ? 
			<Card>
				<DonotedBox message={"Donation has not started!"}/>					
			</Card> : beneficiaryData !== undefined && beneficiaryData.timestamp > 0 ? 
			<Card>
				<DonotedBox message={"This account has donated!"}/>
			</Card> : <></>
			}
			</Box> : ""}
			<Box height={5}></Box>
			<Modal 
				isOpen={isOpen} 
				onClose={onClose} 
				closeOnOverlayClick={false}
				isCentered
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{modalOptions.buttonName}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{modalOptions.message}
						<Button
							fontFamily={'heading'}
							mb={2}
							mt={5}
							w={'full'}
							bg={"green.500"}
							// bgGradient="linear(to-r, red.400,pink.400)"
							_hover={{bg: "green.600"}}
							_active={{bg: "green.600"}}
							color={'white'}
							onClick={modalOptions.fun === "release" ? release : redeem}
							isLoading={isLoading}
							isDisabled={isDisabled}
							>
							{modalOptions.buttonName}
						</Button>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Stack>
	)
}

const DonotedBox = (props) => {
	return (
		<Box
			justifyContent={"center"}
			textAlign={"center"}
			as={"form"}
			p={5}
			mt={2}
			ml={20}
			mr={20}
			mb={10}
		>
			<Box fontSize={"3xl"} fontWeight={"bold"} mb={10} color={"#E53E3E"}>{props.message}</Box>
		</Box>
	)
}

const InputDonate = () => {
	const { isOpen, onOpen, onClose } = useDisclosure()

	const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
		useNumberInput({
			step: 0.01, 
			defaultValue: 0.5,
			min: 0.3,
			max: 0.6,
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
				mt={5}
				pl={"5%"}
				pr={"5%"}
				// as={"form"}
				// p={5}
				>
				<HStack 
					maxW="full"
					color={useColorModeValue('black', '#dcdcdc')}
				>
					<Button {...dec}>-</Button>
					<Input {...input} />
					<Button {...inc}>+</Button>
				</HStack>
				<Button
					fontFamily={"heading"}
					mt={5}
					mb={3}
					w={"full"}
					bg={"green.500"}
					_hover={{bg: "green.600"}}
					_active={{bg: "green.600"}}
					color={"white"}
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
	const { priceRange } = useDonate();
	const formatThousands = require('format-thousands');
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
			<Heading 
				fontSize="2xl" 
				align="left" 
				ml={10} 
				mt={5}
				p={5} 
				color={useColorModeValue('black.700', '#dcdcdc')}
			>
				RATE PLAN
			</Heading>
			<Table 
				ml={"5%"} 
				mr={"5%"} 
				width={"90%"} 
				variant="simple" 
				color={useColorModeValue('black.700', '#dcdcdc')}
				wordBreak={"break-word"}
				fontSize={"sm"}
			>
				<Thead>
					<Tr>
						<Th>#</Th>
						<Th>From</Th>
						{/* <Th> to</Th> */}
						<Th> rate</Th>
					</Tr>
				</Thead>
				<Tbody>
				{priceRange.length > 0 && priceRange.map((range, idx) => (
						<Tr key={idx}>
							<Td>{idx+1}</Td>
							<Td>{formatThousands(ethers.utils.formatEther(range.fromAmount), {separator: ','})} CPT</Td>
							<Td>{idx === priceRange.length - 1 ? 'CAP' : formatThousands(range.price.toString(), {separator: ','}) + ' CPT/BNB'}</Td>
						</Tr>
					))
				}
				</Tbody>
			</Table>
		</Box>
	);
};