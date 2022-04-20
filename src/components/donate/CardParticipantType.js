import React from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useDonate } from "contexts/DonateContext";
import { Blur } from '../common/Blur';

const Feature = ({ title, desc, onClick, status, ...rest }) => {
    return (
      <Box
        p={5}
        mb={5}
        shadow="md"
        borderWidth="1px"
        flex="1"
        borderRadius="md"
        {...rest}
      >
        <Heading fontSize="xl">{title}</Heading>
        <Text mt={5} mb={5}>{desc}</Text>
        <Button onClick={onClick} isDisabled={status}>
          GO
        </Button>
      </Box>
    );
  };

  export const CardParticipantType = () => {
    const { setParticipantID } = useDonate();
    return (
      <Box mx="auto">
        <Text fontSize={'2xl'} mb={2}>Select your participant</Text>
        <Blur
          position={"absolute"}
          top={-10}
          left={-10}
          style={{ filter: "blur(70px)" }}
        />
        <Feature
          title="Private sale"
          desc="Private sale for ChatPuppy"
          onClick={() => setParticipantID(1)}
          status={true}
        />
        <Feature
          title="Public sale"
          desc="Public sale for ChatPuppy"
          onClick={() => setParticipantID(2)}
          status={false}
        />
        <Feature
          title="Team"
          desc="Team members claim vesting tokens"
          onClick={() => setParticipantID(3)}
          status={false}
        />
        <Feature
          title="Advisor"
          desc="Advisors claim vesting tokens"
          onClick={() => setParticipantID(4)}
          status={false}
        />
        <Feature
          title="Marketing"
          desc="Marketing claim vesting tokens"
          onClick={() => setParticipantID(7)}
          status={false}
        />
      </Box>
    );
  };
