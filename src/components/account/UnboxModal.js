import React, { useState } from "react";
import { Box, Flex, Image, Badge, useColorModeValue, Button, Center, useToast, Spinner } from "@chakra-ui/react";
import BoxImageSrc from "assets/mysteryBox.jpg"
import { ethers } from "ethers";
import nft_manager_v2_abi from "abi/nft_manager_v2_abi.json"
import { useAuth } from "contexts/AuthContext";
import { NFT_MANAGER_V2_ADDRESS, TOKEN_NAME} from 'constants';

const UnboxModal = (props) => {

    const [ isLoading, setIsLoading ] = useState(false);
    const { currentAccount, currentNetwork } = useAuth()

    const NFT_manager_contract_address = NFT_MANAGER_V2_ADDRESS;
    const toast = useToast()
    const { metadata } = props;
    const id = 'toast'

    const property = {
        imageUrl: BoxImageSrc,
        imageAlt: "Mystery Box",
        title: "Title Info about the product",
        rating: 4,
    };

    const upload = () => {

    }

    return (
    <Flex
      bg={useColorModeValue("white", "gray.700")}
      w="full"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        bg={useColorModeValue("white", "gray.700")}
        maxW="sm"
      >
        <Image
          src={property.imageUrl}
          alt={property.imageAlt}
          roundedTop="lg"
        />

        <Box p="6">
        </Box>
        <Button
            fontFamily={'heading'}
            mb={3}
            w={'full'}
            h={12}
            bgGradient="linear(to-r, brand.200,brand.200)"
            color={'white'}
            _hover={{
                bgGradient: 'linear(to-r, brand.150,brand.150)',
                boxShadow: 'xl',
            }}
            _active={{
                bgGradient: 'linear(to-r, brand.200,brand.200)',
                boxShadow: 'xl',
            }}
            onClick={upload}
            isLoading={isLoading}
            >
            Upload
        </Button>
      </Box>
    </Flex>
  );
};

export default UnboxModal;