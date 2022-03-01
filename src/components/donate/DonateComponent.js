import React, { useState, useCallback, useEffect } from "react";

import {
  useColorModeValue,
  Box,
  Button,
  Heading,
  Stack,
  Text,
  useToast,
  HStack,
  Spinner,
  List,
  ListItem,
  Table,
  Tbody,
  Tr,
  Td,
  Container,
  
} from "@chakra-ui/react";

import DonateModal from "./donateModal";
import { CardParticipantType } from "./CardParticipantType";

import { DateTime } from "luxon";

import { ethers } from "ethers";
import { useAuth } from "contexts/AuthContext";
import { useDonate } from "contexts/DonateContext";
import { getNameSaleById } from "utils/getNameSaleById";

import { Card } from "../common/Card";
import { Blur } from "../common/Blur";
import { DonateView } from "./DonateView";
import { BeneficiaryView } from "./BeneficiaryView";

import {
  loadBeneficiaryCount,
  loadBeneficiary,
  loadReleasable,
  loadCap,
  loadCrowdFundingParams,
  loadIndex,
  loadParticipantPriceRange,
  loadParticipantReleasable,
  loadTotalParticipant,
  totalDonateAmount,

} from "utils/tokenVestingsInteract";

export default function DonateComponent() {
  const {  currentAccount } = useAuth();

  const {
    setBeneficiaryReleasable,
    setTotal,
    setDataDonate,
    priceRange,
    setParticipantReleasable,
    setParticipantReleased,
    setTotalParticipant,
    setBeneficiaryRedeem,
    setParticipantPriceRange,
    setBeneficiaryCount,
    setCap,
    setParticipantID,
    setBeneficiaryReleased,
    participantID,
    donateData,
    setUserIndexHash,
    setBeneficiaryData,
    setReleasable,
    setUserIndex,
    userIndex,
  } = useDonate();

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
      setTotalParticipant(totalParticipants);
      
    }
    fetchTotalDonate();
    fetchTotalParticipants();
  }, [ participantID, setTotal, setTotalParticipant]);

  
  useEffect(() => {
    async function Index() {
      const reponseIndex = await loadIndex(participantID, currentAccount);
      setUserIndex(reponseIndex[1]);
      if(reponseIndex[0]) setBeneficiaryData(await loadBeneficiary(reponseIndex[1]));
    }
    
    Index();
  },[currentAccount, participantID,  setUserIndex, setBeneficiaryData])

  
  useEffect(() => {
    async function getCap(){
      const cap = await loadCap(participantID);
      const ratio = ethers.utils.formatEther(cap);
      setCap(ratio);
    }
    getCap();
  },[participantID, setCap])

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
        {participantID === 0 ? (<CardParticipantType />
        ) : participantID > 0 ? (
          <DonateView />
        ) : userIndex ? <BeneficiaryView /> : (
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