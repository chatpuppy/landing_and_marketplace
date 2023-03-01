/* eslint-disable react/prop-types */
import React from 'react';
import { Box, Progress } from '@chakra-ui/react';

const ConfirmationProgress = (props) => {
  const { hidden, message, value, step } = props;

  return (
    <Box>
      {hidden ? (
        <Box></Box>
      ) : (
        <Box w="full" pb={5} mx="auto">
          {'Step ' + step + ': ' + message}
          <Progress mt={3} size="xs" colorScheme="gray" value={value} />
        </Box>
      )}
    </Box>
  );
};

export default ConfirmationProgress;
