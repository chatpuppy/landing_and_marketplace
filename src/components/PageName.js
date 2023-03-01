/* eslint-disable react/prop-types */
import React from 'react';
import { Center, Image } from '@chakra-ui/react';

export default function PageName(props) {
  const { name, pic } = props;

  return (
    <Center h="20vh" w="80vw" my="6" mx="auto" bg="brand.100" rounded="lg">
      <Image src={pic} alt={name}></Image>
    </Center>
  );
}
