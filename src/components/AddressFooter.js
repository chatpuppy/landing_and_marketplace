import {
    Box,
    Container,
    Link,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import {NFT_TOKEN_ADDRESS, ETHERSCAN_BASE_URL, NFT_MANAGER_ADDRESS} from 'constants';
  
function shortenAddress(address) {
    return address.substr(0, 6) + "..." + address.substr(address.length - 6, 6)
}

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
                <Link href={ETHERSCAN_BASE_URL + NFT_TOKEN_ADDRESS}
                isExternal mr="1">{shortenAddress(NFT_TOKEN_ADDRESS)}  {""}<ExternalLinkIcon /></Link>
            </Text>
            <Text>NFT Manager Address: {""}
                <Link href={ETHERSCAN_BASE_URL + NFT_MANAGER_ADDRESS}
                isExternal mr="1">{shortenAddress(NFT_MANAGER_ADDRESS)}  {""}<ExternalLinkIcon /></Link>
            </Text>
        </Container>
        </Box>
    );
}