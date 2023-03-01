/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Heading,
  Text,
  Container,
  Button,
  useBreakpointValue,
  Icon,
  useNumberInput,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import MintModal from './MintModal';
import { ethers } from 'ethers';
import nft_manager_v2_abi from 'abi/nft_manager_v2_abi';
import { getNetworkConfig } from 'constants';

export default function MintGrid(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [boxPrice, setBoxPrice] = useState();
  const [mintButtonEnable, setMintButtonEnable] = useState(false);
  const toast = useToast();

  let NFT_manager_contract_address;

  /*
	in case we need to do buyAndMintBatch(amount)
	*/
  const { getInputProps } = useNumberInput({
    step: 1,
    defaultValue: 1,
    min: 1,
    max: 3,
    precision: 0,
  });

  // const inc = getIncrementButtonProps()
  // const dec = getDecrementButtonProps()
  const input = getInputProps({ isReadOnly: false });

  const getBoxPrice = async () => {
    if (!props.chainId) return;
    const networkConfig = getNetworkConfig(props.chainId);
    NFT_manager_contract_address = networkConfig.supportChainlinkVRFV2
      ? networkConfig.nftManagerV2Address
      : networkConfig.nftManagerAddress;

    setMintButtonEnable(
      NFT_manager_contract_address !== undefined &&
        NFT_manager_contract_address !== ''
    );

    if (
      NFT_manager_contract_address === '' ||
      NFT_manager_contract_address === undefined
    ) {
      toast({
        title: 'Mint',
        description: 'Mint is only available on Ethereum blockchain',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    try {
      const { ethereum } = window; //injected by metamask
      //connect to an ethereum node
      const provider = new ethers.providers.Web3Provider(ethereum);
      //gets the account
      const signer = provider.getSigner();
      //connects with the contract
      const NFTManagerConnectedContract = new ethers.Contract(
        NFT_manager_contract_address,
        nft_manager_v2_abi,
        signer
      );
      const _boxPrice = await NFTManagerConnectedContract.boxPrice();
      setBoxPrice(parseInt(_boxPrice['_hex'], 16) / Math.pow(10, 18));
    } catch (err) {
      // console.log(err);
    }
  };

  useEffect(() => {
    let isConnected = false;

    if (!isConnected) {
      getBoxPrice();
    }

    return () => {
      isConnected = true;
    };
  }, [props.chainId]);
  return (
    <Box position={'relative'}>
      <Container
        // as={SimpleGrid}
        columns={{ base: 1, md: 1 }}
        spacing={{ base: 10, lg: 32 }}
        py={{ base: 10, sm: 20, lg: 32 }}
        justify={'center'}
        align={'center'}>
        <Stack
          bg={useColorModeValue('gray.50', 'white')}
          border="1px"
          borderColor="gray.300"
          rounded={'xl'}
          p={{ base: 4, sm: 6, md: 8 }}
          spacing={{ base: 8 }}
          maxW={{ lg: 'sm' }}>
          <Stack spacing={4}>
            <Heading
              color={'gray.800'}
              lineHeight={1.1}
              fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
              Mint ChatPuppy NFT
              {/* <Text
                    as={'span'}
                    bgGradient="linear(to-r, red.400,pink.400)"
                    bgClip="text">
                    !
                </Text> */}
            </Heading>
            <Text
              color={'gray.500'}
              fontSize={{ base: 'sm', sm: 'md' }}
              textAlign="left">
              {`Get a NFT for avatar, with which you can get premium access to
              ChatPuppy Dapp's exclusive features!`}
            </Text>
          </Stack>
          <Box as={'form'} mt={10}>
            <Button
              fontFamily={'heading'}
              w={'full'}
              h={12}
              isDisabled={!mintButtonEnable}
              bgGradient="linear(to-r, brand.200,brand.200)"
              color={'white'}
              _hover={{
                // bgGradient: 'linear(to-r, brand.150,brand.150)',
                boxShadow: 'xl',
              }}
              _active={{
                // bgGradient: 'linear(to-r, brand.200,brand.200)',
                boxShadow: 'xl',
              }}
              onClick={onOpen}>
              Mint
            </Button>
          </Box>
          <Stack spacing={2}>
            {/* <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }} textAlign="left">
            &#9900; You can only mint a mystery avatar or mint &#38; unbox simultaneously. 
            </Text> */}
            <Text
              color={'gray.500'}
              fontSize={{ base: 'sm', sm: 'md' }}
              textAlign="left">
              {`After you mint, you will get a Mystery Box but you don't
              know what the exact avatar is until it is unboxed.`}
            </Text>
            <Text
              color={'gray.500'}
              fontSize={{ base: 'sm', sm: 'md' }}
              textAlign="left">
              &#9900; The Mystery Box and unboxed NFTs are all available for
              sale.
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
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mint</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <MintModal count={input.value} boxPrice={boxPrice} />
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
