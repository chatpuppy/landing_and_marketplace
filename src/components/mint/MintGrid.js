import {
    Box, Stack, Heading, Text, Container, Button, SimpleGrid, 
    useBreakpointValue, Icon, useNumberInput, useColorModeValue,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
    ModalCloseButton, useDisclosure
} from '@chakra-ui/react';
import MintModal from './MintModal';

export default function MintGrid() {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: 1,
      min: 1,
      max: 3,
      precision: 0
    })

    const inc = getIncrementButtonProps()
    const dec = getDecrementButtonProps()
    console.log(inc, dec)
    const input = getInputProps({ isReadOnly: false })

return (
    <Box position={'relative'}>
    <Container
        as={SimpleGrid}
        columns={{ base: 1, md: 1 }}
        spacing={{ base: 10, lg: 32 }}
        py={{ base: 10, sm: 20, lg: 32 }}
        justify={'center'}
        align={'center'}>
        <Stack
        bg={useColorModeValue('gray.50', 'white')}
        border="2px"
        rounded={'xl'}
        p={{ base: 4, sm: 6, md: 8 }}
        spacing={{ base: 8 }}
        maxW={{ lg: 'lg' }}>
            <Stack spacing={4}>
                <Heading
                color={'gray.800'}
                lineHeight={1.1}
                fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
                Mint mystery puppy avatars
                <Text
                    as={'span'}
                    bgGradient="linear(to-r, red.400,pink.400)"
                    bgClip="text">
                    !
                </Text>
                </Heading>
                <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
                Acquire NFTs for avatar in ChatPuppy, with which you can get premium access to ChatPuppy's exclusive features!
                </Text>
            </Stack>
            <Box as={'form'} mt={10}>
                {/*
                <Stack spacing={4}>
                    <HStack maxW='320px'>
                    <Button bg="gray.300" color="black" {...dec}
                    _hover={{
                        bg:"gray.400"
                    }}
                    _active={{
                        bg:"gray.300"
                    }}
                    >-</Button>
                    <Input color="black" outlineColor="gray.300" {...input} />
                    <Button bg="gray.300" color="black"  {...inc}
                    _hover={{
                        bg:"gray.400"
                    }}
                    _active={{
                        bg:"gray.300"
                    }}
                    >+</Button>
                    <p>Avatar{input.value==="1"? "": "s"}</p>
                    </HStack>
                </Stack>
                */}
                <Button
                fontFamily={'heading'}
                w={'full'}
                bgGradient="linear(to-r, red.400,pink.400)"
                color={'white'}
                _hover={{
                    bgGradient: 'linear(to-r, red.400,pink.400)',
                    boxShadow: 'xl',
                }}
                _active={{
                    bgGradient: 'linear(to-r, red.200,pink.200)',
                    boxShadow: 'xl',
                }}
                onClick={onOpen}
                >
                
                Mint
                </Button>
            </Box>
            <Stack spacing={2}>
            <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
            &#9900; You can only mint a mystery avatar or mint &#38; unbox simultaneously. 
            </Text>
            <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
            &#9900; If you only mint, you will not know what the exact avatar is until it is unboxed.
            </Text>
            <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
            &#9900; The mystery avatars and NFTs are all available for selling.
            </Text>
            </Stack>
        </Stack>
    </Container>
    <Blur
        position={'absolute'}
        top={-10}
        left={-10}
        style={{ filter: 'blur(70px)' }}
    />
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <MintModal count={input.value}/>
          </ModalBody>
        </ModalContent>
    </Modal>
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