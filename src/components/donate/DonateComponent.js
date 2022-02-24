import React, { useState, useCallback, useEffect } from "react";

import {
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
  loadCap,
  loadCrowdFundingParams,
  loadIndex,
  loadParticipantPriceRange,
  loadParticipantReleasable,
  loadTotalParticipant,
  totalDonateAmount,
} from "utils/tokenVestingsInteract";

export default function DonateComponent() {
  const { setCurrentAccount, currentAccount, currentNetwork } = useAuth();

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
    setUserIndex,
    userIndex,
  } = useDonate();

  useEffect(() => {
    async function fetchCrowd() {
      const crowdParams = await loadCrowdFundingParams(participantID);
      setDataDonate(crowdParams);
      console.log("Participant:", participantID);
      console.log(crowdParams);
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
      const priceRange = await loadParticipantPriceRange(participantID);
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
    }
    
    async function IndexHash(){
      const reponseIndex = await loadIndex(participantID, currentAccount);
      setUserIndexHash(reponseIndex[0]);
      console.log(participantID)
      console.log(currentAccount)
    }
    Index();
    IndexHash();
  },[currentAccount, participantID,  setUserIndex, setUserIndexHash])

  
  useEffect(() => {
    async function getCap(){
      const cap = await loadCap(participantID);
      setCap(cap);
    }
    getCap()},[participantID, setCap])


  return (
    <>
      {participantID === 0 ? (<CardParticipantType />
      ) : participantID > 0 ? (
        <DonateView />
      ) : userIndex ? <BeneficiaryView /> : (
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