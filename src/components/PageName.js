import React from 'react'
import { Center, useColorModeValue, Heading } from '@chakra-ui/react';

export default function PageName(props) {

    const { name } = props;

    return (
        <Center h="10vh" w={{base: "90vw", sm: "50vw"}} my="6" mx="auto" bg="brand.100"
            rounded="lg"
        >
            <Heading fontSize={{ base: "3xl", sm: "4xl" }}
            fontWeight="extrabold"
            letterSpacing="tight"
            lineHeight="shorter"
            color={useColorModeValue("gray.100", "gray.100")}
            >
                {name}
            </Heading>
        </Center>
    )
}
