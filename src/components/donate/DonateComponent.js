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

import {
  loadBeneficiaryCount,
  loadBeneficiary,
  loadReleasable,
	loadPriceForAmount,
  loadCrowdFundingParams,
  loadIndex,
  loadParticipantPriceRange,
  loadParticipantReleasable,
  loadTotalParticipant,
  totalDonateAmount,

} from "utils/tokenVestingsInteract";

export default function DonateComponent() {
  const { currentAccount } = useAuth();

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
    setUserIndex,
    userIndex,
    participantID,
		setParticipantID,
  } = useDonate();

	// ###### To enter into public sale directly, if cancel, it'll show a menu
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
      const totalParticipants = await loadTotalParticipant(participantID);
			const price = await loadPriceForAmount(participantID, totalParticipants);
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

  return (
    <Box as="section" height="100vh" overflowY="auto">
      <Container 
        color={useColorModeValue("gray.800", "inherit")}
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
              color="blue.500"
              alignItems="center"
              alignContent="center"
              size="xl"
            />
          </Stack>
        )}
        </Container>
      </Box>
  );
}