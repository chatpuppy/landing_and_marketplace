import React, { useEffect } from "react";

import {
  useColorModeValue,
  Box,
  Stack,
  Spinner,
  Container,
  
} from "@chakra-ui/react";

import { CardParticipantType } from "./CardParticipantType";

import { useAuth } from "contexts/AuthContext";
import { useDonate } from "contexts/DonateContext";
import { DonateView } from "./DonateView";
import { BeneficiaryView } from "./BeneficiaryView";
import NavBar from 'components/NavBar'

import {
  loadBeneficiaryCount,
  loadBeneficiary,
  loadReleasable,
	loadRedeemable,
	loadPriceForAmount,
  loadCrowdFundingParams,
  loadIndex,
  loadParticipantPriceRange,
  loadParticipantReleasable,
  loadTotalParticipant,
  totalDonateAmount,

} from "utils/tokenVestingsInteract";

export default function DonateComponent() {
  const { currentAccount, currentNetwork} = useAuth();

  const {
    setTotal,
    setDataDonate,
    setParticipantReleased,
    setTotalParticipant,
		setPriceForAmount,
    setParticipantPriceRange,
    setBeneficiaryCount,
    setBeneficiaryData,
    setReleasable,
		setRedeemable,
    setUserIndex,
    userIndex,
    participantID,
		setParticipantID,
  } = useDonate();

	const color = useColorModeValue("gray.800", "inherit");
	// To enter into public sale directly, if cancel, it'll show a menu
	const defaultParticipantID = 2;
	useEffect(() => {
		setParticipantID(defaultParticipantID); // Default is public sale #2
	}, [setParticipantID])

  useEffect(() => {
    async function fetchCrowd() {
      const crowdParams = await loadCrowdFundingParams(participantID);
      setDataDonate(crowdParams);
    }
    if(participantID === defaultParticipantID) fetchCrowd();
  }, [currentAccount,participantID,setDataDonate]);

  useEffect(() => {
    async function BeneficiaryData() {
      const participantReleased = await loadParticipantReleasable(
        participantID
      );
      setParticipantReleased(participantReleased);
    }
    async function beneficiaryCount() {
      const beneficiaryCount = await loadBeneficiaryCount(participantID);
      setBeneficiaryCount(beneficiaryCount);
    }
		
    if(participantID === defaultParticipantID) {
			BeneficiaryData();
			beneficiaryCount();	
		}
  },[participantID, setBeneficiaryCount, setParticipantReleased])

  useEffect(() => {
    async function fetchPriceData() {
      let priceRange = await loadParticipantPriceRange(participantID);
      setParticipantPriceRange(priceRange);
    }
    if(participantID === defaultParticipantID) fetchPriceData();
  },[participantID, setParticipantPriceRange])

  useEffect(() => {
    async function fetchTotalDonate() {
      const totalDonate = await totalDonateAmount();
      setTotal(totalDonate);
    }
    async function fetchTotalParticipants() {
      const totalParticipants = await loadTotalParticipant(participantID);
      setTotalParticipant(totalParticipants);
    }
		async function getPriceForAmount() {
			const price = await loadPriceForAmount(participantID, '100000000000000000');
			setPriceForAmount(price);
		}
		if(participantID === defaultParticipantID) {
			fetchTotalDonate();
			fetchTotalParticipants();
			getPriceForAmount();	
		}
  }, [ participantID, setTotal, setTotalParticipant, setPriceForAmount]);

  useEffect(() => {
    async function Index() {
      const reponseIndex = await loadIndex(participantID, currentAccount);
      if(reponseIndex === undefined) return;
      setUserIndex(reponseIndex[1]);
      if(reponseIndex[0]) setBeneficiaryData(await loadBeneficiary(reponseIndex[1]));
    }
    if(participantID === defaultParticipantID) Index();
  },[currentAccount, participantID,  setUserIndex, setBeneficiaryData])

  useEffect(() => {
    async function getReleasable() {
      const releasable = await loadReleasable(participantID, currentAccount);
      setReleasable(releasable);
    }
    if(participantID === defaultParticipantID) getReleasable();
  }, [participantID, setReleasable, currentAccount])

	useEffect(() => {
		async function getRedeemable() {
			const redeemable = await loadRedeemable(participantID, currentAccount);
			setRedeemable(redeemable);
		}
		if(participantID === defaultParticipantID) getRedeemable();
	}, [currentAccount, participantID, setRedeemable])

	useEffect(() => {
		if(currentNetwork !== 56) {
			window.ethereum.request({
				method: "wallet_addEthereumChain",
				params: [{
						chainId: "0x38",
						rpcUrls: ["https://bsc-dataseed1.binance.org"],
						chainName: "Binance Smart Chain",
						nativeCurrency: {
								name: "BNB",
								symbol: "BNB",
								decimals: 18
						},
						blockExplorerUrls: ["https://bscscan.com/"]
				}]
			});
		}
	}, [currentNetwork, currentAccount])

  return (
		<>
			{currentNetwork !== 56 ? 
			<>
			<Box as="section" height="80vh" overflowY="auto">
      <NavBar action="/donate" showMenu={false}/>
			</Box>
			</> :
			<>
			<Box as="section" height="100vh" overflowY="auto">
      <NavBar action="/donate" showMenu={true}/>
      <Container 
        color={color}
        maxW='container.lg'
        >
        {participantID === 0 ? <CardParticipantType />
         : participantID > 0 ? 
          <DonateView />
         : userIndex ? <BeneficiaryView /> : (
          <Stack
            bg={{dark: "gray.900", light: "gray.50"}}
            color={{dark: "white", light: "dark"}}
            spacing={{
              base: "8",
              lg: "6",
            }}
          >
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="green.500"
              alignItems="center"
              alignContent="center"
              size="xl"
            />
          </Stack>
        )}
      </Container>
			</Box>
			</>}
		</>
  );
}