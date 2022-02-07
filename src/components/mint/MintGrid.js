import {
    Box, Stack, Heading, Text, Container, Input,
    Button, SimpleGrid, useBreakpointValue, Icon, HStack, useNumberInput, Image
} from '@chakra-ui/react';

export default function MintGrid() {

    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: 1,
      min: 0,
      max: 10000,
    })

    const inc = getIncrementButtonProps()
    const dec = getDecrementButtonProps()
    const input = getInputProps({ isReadOnly: false })
    console.log(input)

return (
    <Box position={'relative'}>
    <Container
        as={SimpleGrid}
        maxW={'7xl'}
        columns={{ base: 1, md: 2 }}
        spacing={{ base: 10, lg: 32 }}
        py={{ base: 10, sm: 20, lg: 32 }}>
        <Stack spacing={{ base: 10, md: 20 }}>
            <Image src="https://kutty.netlify.app/hero.jpg" 
            shadow="lg" rounded="md"
            />
        </Stack>
        <Stack
        bg={'gray.50'}
        rounded={'xl'}
        p={{ base: 4, sm: 6, md: 8 }}
        spacing={{ base: 8 }}
        maxW={{ lg: 'lg' }}>
        <Stack spacing={4}>
            <Heading
            color={'gray.800'}
            lineHeight={1.1}
            fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
            Mint a Mystery Box
            <Text
                as={'span'}
                bgGradient="linear(to-r, red.400,pink.400)"
                bgClip="text">
                !
            </Text>
            </Heading>
            <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
            Acquire one of a kind NFTs, with which you get premium
            access to ChatPuppy's exclusive features!
            </Text>
        </Stack>
        <Box as={'form'} mt={10}>
            <Stack spacing={4}>
                <HStack maxW='320px'>
                <Button {...dec}>-</Button>
                <Input {...input} />
                <Button {...inc}>+</Button>
                </HStack>
            </Stack>
            <Button
            fontFamily={'heading'}
            mt={8}
            w={'full'}
            bgGradient="linear(to-r, red.400,pink.400)"
            color={'white'}
            _hover={{
                bgGradient: 'linear(to-r, red.400,pink.400)',
                boxShadow: 'xl',
            }}>
            Mint
            </Button>
        </Box>
        </Stack>
    </Container>
    <Blur
        position={'absolute'}
        top={-10}
        left={-10}
        style={{ filter: 'blur(70px)' }}
    />
    </Box>
);
}

export const Blur = (props) => {
    return (
        <Icon
        width={useBreakpointValue({ base: '100%', md: '40vw', lg: '30vw' })}
        zIndex="-1"
        height="560px"
        viewBox="0 0 528 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}>
        <circle cx="71" cy="61" r="111" fill="#F56565" />
        <circle cx="244" cy="106" r="139" fill="#ED64A6" />
        <circle cy="291" r="139" fill="#ED64A6" />
        <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" />
        <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" />
        <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
        <circle cx="426.5" cy="-0.5" r="101.5" fill="#4299E1" />
        </Icon>
    );
};