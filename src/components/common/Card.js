import React, { Box, useColorModeValue } from '@chakra-ui/react';

export const Card = (props) => (
  <Box
    minH="36"
    bg={useColorModeValue('gray.100', '#161b26')}
    boxShadow={useColorModeValue('gray.800', 'inherit')}
    borderRadius="lg"
    {...props}
  />
);
