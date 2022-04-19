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
	useEffect(() => {
		setParticipantID(2); // Default is public sale #2
	}, [])

  useEffect(() => {
    async function fetchCrowd() {
      const crowdParams = await loadCrowdFundingParams(participantID);
      setDataDonate(crowdParams);
    }
    fetchCrowd();
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
    BeneficiaryData();
    beneficiaryCount();
  },[participantID, setBeneficiaryCount, setParticipantReleased])

  useEffect(() => {
    async function fetchPriceData() {
      let priceRange = await loadParticipantPriceRange(participantID);
      setParticipantPriceRange(priceRange);
    }
    fetchPriceData();
  },[participantID, setParticipantPriceRange])

  useEffect(() => {
    async function fetchTotalDonate() {
      const totalDonate = await totalDonateAmount();
      setTotal(totalDonate);
    }
    async function fetchTotalParticipants() {
      const totalParticipants = await loadTotalParticipant(participantID);
			console.log("+++", totalParticipants.toString());
      setTotalParticipant(totalParticipants);
    }
		async function getPriceForAmount() {
      const totalParticipants = await loadTotalParticipant(participantID);
			const price = await loadPriceForAmount(participantID, totalParticipants);
			setPriceForAmount(price);
		}
    fetchTotalDonate();
    fetchTotalParticipants();
		getPriceForAmount();
  }, [ participantID, setTotal, setTotalParticipant, setPriceForAmount]);

  
  useEffect(() => {
    async function Index() {
      const reponseIndex = await loadIndex(participantID, currentAccount);
      if(reponseIndex === undefined) return;
      setUserIndex(reponseIndex[1]);
      if(reponseIndex[0]) setBeneficiaryData(await loadBeneficiary(reponseIndex[1]));
    }
    
    Index();
  },[currentAccount, participantID,  setUserIndex, setBeneficiaryData])

  useEffect(() => {
    async function getReleasable() {
      const releasable = await loadReleasable(participantID, currentAccount);
      setReleasable(releasable);
    }
    getReleasable();
  }, [participantID, setReleasable, currentAccount])

  return (
    <Box as="section" height="100vh" overflowY="auto">
      <Container 
        color={useColorModeValue("gray.800", "inherit")}
        maxW='container.lg'
       
        // columns={{ base: 1, md: 1 }}
        // spacing={{ base: 10, lg: 32 }}
        // py={{ base: 10, sm: 20, lg: 32 }}
        // justify={'center'}
        // align={'center'}
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