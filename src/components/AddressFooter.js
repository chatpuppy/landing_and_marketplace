import {
    Box,
    Container,
    Link,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
  
export default function AddressFooter() {
    return (
        <Box 
        bg={useColorModeValue('gray.50', 'gray.900')}
        color={useColorModeValue('gray.700', 'gray.200')}>
        <Container
            as={Stack}
            maxW={'6xl'}
            py={10}
            direction={{ base: 'column', md: 'row' }}
            spacing={4}
            justify={{ base: 'center', md: 'space-between' }}
            align={{ base: 'center', md: 'center' }}>
            <Text>Contract Addresses: </Text>
            <Text>NFT Address: {""}
                <Link href="https://kovan.etherscan.io/address/0xAb50F84DC1c8Ef1464b6F29153E06280b38fA754" 
                isExternal mr="1">0xAb5...8fA754  {""}<ExternalLinkIcon /></Link>
            </Text>
            <Text>NFT Manager Address: {""}
                <Link href="https://kovan.etherscan.io/address/0x0528E41841b8BEdD4293463FAa061DdFCC5E41bd" 
                isExternal mr="1">0x052...5E41bd  {""}<ExternalLinkIcon /></Link>
            </Text>
        </Container>
        </Box>
    );
}