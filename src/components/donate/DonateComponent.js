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
  const [isLoading, setIsLoading] = useState(false);
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
  } = useDonate();

  useEffect(() => {
    async function fetchCrowd() {
      const crowdParams = await loadCrowdFundingParams(participantID);
      setDataDonate(crowdParams);
    }
    async function capAndIndex() {
      const cap = await loadCap(participantID);
      const reponseIndex = await loadIndex(participantID, currentAccount);
      setCap(cap);
      setUserIndexHash(reponseIndex[0]);
      setUserIndex(reponseIndex[1]);
    }

    fetchCrowd();
    capAndIndex();
  }, [
    currentAccount,
    participantID,
    setCap,
    setDataDonate,
    setUserIndex,
    setUserIndexHash,
  ]);

  useEffect(() => {
    async function fetchTotal() {
      const totalDonate = await totalDonateAmount();
      const totalParticipants = await loadTotalParticipant(participantID);
      setTotalParticipant(totalParticipants);
      setTotal(totalDonate);
    }
    async function BeneficiaryData() {
      const participantReleased = await loadParticipantReleasable(
        participantID
      );
      setParticipantReleased(participantReleased);

      const beneficiaryCount = await loadBeneficiaryCount(participantID);
      setBeneficiaryCount(beneficiaryCount);
    }
    async function fetchPriceData() {
      const priceRange = await loadParticipantPriceRange(participantID);
      setParticipantPriceRange(priceRange);
    }
    fetchTotal();
    BeneficiaryData();
    fetchPriceData();
  }, [
    currentAccount,
    participantID,
    setBeneficiaryCount,
    setCap,
    setParticipantPriceRange,
    setParticipantReleased,
    setTotal,
    setTotalParticipant,
    setUserIndex,
    setUserIndexHash,
  ]);

  return (
    <>
      {participantID ? (
        <CardParticipantType />
      ) : donateData ? (
        <DonateView />
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

const Feature = ({ title, desc, onClick, status, ...rest }) => {
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
      <Button onClick={onClick} isDisabled={status}>
        {" "}
        Donate{" "}
      </Button>
    </Box>
  );
};

const CardParticipantType = () => {
  // const [participantID, setParticipantID] = useState(0);
  const { setParticipantID } = useDonate();

  return (
    <Box px={8} py={24} mx="auto">
      <HStack spacing={8}>
        <Feature
          title="Public Sale"
          desc="Public sale Description"
          onClick={setParticipantID(2)}
          status={false}
        />
        <Feature
          title="Private Sale"
          desc="Description"
          onClick={setParticipantID(1)}
          status={true} // button for activated sale
        />
      </HStack>
    </Box>
  );
};
