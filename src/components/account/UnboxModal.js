import React, { useState, useEffect } from "react";
import { Box, Flex, Image, Badge, useColorModeValue, Button, Center, useToast, Spinner } from "@chakra-ui/react";
// import { ethers } from "ethers";
import { useAuth } from "contexts/AuthContext";
import { sortLayer, mergeLayers } from "avatar";
import mergeImages from 'merge-images';

const UnboxModal = (props) => {

    const [ isLoading, setIsLoading ] = useState(false);
    const [ imageBase64, setImageBase64 ] = useState('');
    // const { currentAccount, currentNetwork } = useAuth();

    const toast = useToast()
    const { metadata, tokenId } = props;
    const id = 'toast'
  
    const parseMetadata = (md) => {
      const sortedLayers = sortLayer(md.toHexString().substr(10, 12));
      const mergedLayers = mergeLayers(sortedLayers);
      if(mergedLayers.images.length === 0) return null;
  
      let level = 0;
      let experience = 0;
      let rarity = 1;
      for(let i = 0; i < mergedLayers.layers.length; i++) {
        level = level + mergedLayers.layers[i].level;
        experience = experience + mergedLayers.layers[i].experience;
        rarity = rarity * mergedLayers.layers[i].rarity / 1000000;
      }
  
      return {
        metadata: md.toHexString(),
        level,
        experience,
        rarity: (rarity * 1000000).toFixed(4),
        images: mergedLayers.images,
        layers: mergedLayers.layers
      }
    }

    useEffect(() => {
      console.log('loading metadata for ', metadata.toHexString());
      const parsedMetadata = parseMetadata(metadata);
      if(parsedMetadata !== null) {
        mergeImages(parsedMetadata.images).then((b64) => {
          setImageBase64(b64);
        });
      }
  
    }, [metadata])

    const upload = () => {
      console.log(metadata);
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
          src={tokenId > 0 && imageBase64 !== '' ? imageBase64 : './avatar/loading.jpg'}
          alt="Unboxed NFT"
        />

        <Box mt={5} mb={5}>
          TokenId: #{tokenId}
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
            Upload to IPFS
        </Button>
      </Box>
    </Flex>
  );
};

export default UnboxModal;