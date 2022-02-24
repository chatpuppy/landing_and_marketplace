import React, { useState,  useEffect } from "react";
import { useDonate } from "contexts/DonateContext";
import { Box, Heading, HStack, Text, Button } from "@chakra-ui/react";

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

  export const CardParticipantType = () => {
    const [participantID, setParticipantID] = useState(0);

    console.log("participantID on CardParticipantType:", participantID)
    return (
      <Box px={8} py={24} mx="auto">
        <HStack spacing={8}>
          <Feature
            title="Public Sale"
            desc="Public sale Description"
            onClick={() => setParticipantID(2)}
            status={false}
          />
          <Feature
            title="Private Sale"
            desc="Description"
            onClick={() => setParticipantID(1)}
            status={true} // button for activated sale
          />
        </HStack>
      </Box>
    );
  };
