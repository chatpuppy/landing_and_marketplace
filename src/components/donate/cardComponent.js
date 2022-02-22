import {
    Box,
    useColorModeValue,
  } from '@chakra-ui/react'


export const Card = (props) => (
    <Box
      minH="36"
      bg="gray.100"
      boxShadow={useColorModeValue("gray.800", "inherit")}
      borderRadius="lg"
      {...props}
    />
  )