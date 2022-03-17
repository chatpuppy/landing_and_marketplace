import React from 'react'
import { Center, Heading, Image } from '@chakra-ui/react';

export default function PageName(props) {

    const { name, pic } = props;

    return (
        <Center h="20vh" w="80vw" my="6" mx="auto" bg="brand.100"
            rounded="lg"
        >
            <Image
                src={pic}
                alt={name}
            >
            </Image>
            {/* <Heading fontSize={{ base: "3xl", sm: "4xl" }}
            fontWeight="extrabold"
            letterSpacing="tight"
            lineHeight="shorter"
            color="gray.100"
            >
                {name}
            </Heading> */}
        </Center>
    )
}
