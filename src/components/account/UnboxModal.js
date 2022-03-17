import React, { useState, useEffect } from "react";
import { Box, Text, Flex, Image, Badge, useColorModeValue, Button, Center, useToast, Spinner } from "@chakra-ui/react";
import { useAuth } from "contexts/AuthContext";
import { sortLayer, mergeLayers } from "avatar";
import mergeImages from 'merge-images';
import { NFT_STORAGE_TOKEN, NFT_DESCRIPTION, NFT_NAME } from '../../constants';
import { NFTStorage, File, Blob } from 'nft.storage'

const UnboxModal = (props) => {

    const [ isLoading, setIsLoading ] = useState(false);
    const [ nftMetadata, setNftMetadata ] = useState({ipnft: '', url: ''});
    const [ imageBase64, setImageBase64 ] = useState('');
    const [ parsedMd, setParsedMd ] = useState(null);
    const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

    const toast = useToast()
    const { artifacts, tokenId, dna } = props;
    const id = 'toast'
  
    const parseMetadata = (md) => {
      const sortedLayers = sortLayer(md.toHexString().substr(10, 12));
      const mergedLayers = mergeLayers(sortedLayers);
      if(mergedLayers.images.length === 0) return null;
  
      let level = 0;
      let experience = 0;
      let rarity = 1;
      let properties = [];
      for(let i = 0; i < mergedLayers.layers.length; i++) {
        level = level + mergedLayers.layers[i].level;
        experience = experience + mergedLayers.layers[i].experience;
        rarity = rarity * mergedLayers.layers[i].rarity / 1000000;
        properties.push({
          trait_type:  mergedLayers.layers[i].boxName,
          value:  mergedLayers.layers[i].itemName,
          level: mergedLayers.layers[i].level,
          experience: mergedLayers.layers[i].experience,
          rarity: mergedLayers.layers[i].rarity / 1000000
        })
      }
      return {
        artifacts: md.toHexString(),
        level,
        experience,
        properties,
        rarity: (rarity * 1000000).toFixed(4),
        images: mergedLayers.images,
        layers: mergedLayers.layers
      }
    }

    const uploadNFT = async(imageFile, pmd) => {
      const metadata = await client.store({
        name: NFT_NAME + ' #' + tokenId,
        description: NFT_DESCRIPTION,
        image: imageFile,
        image_url: imageFile,
        external_url: "https://chatpuppy.com",
        dna,
        artifacts: artifacts.toHexString(),
        level: pmd.level,
        experience: pmd.experience,
        rarity: pmd.rarity,
        properties: pmd.properties
      })
      setNftMetadata(metadata);
    }

    const dataURLtoFile = (dataurl, filename) => { 
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type: mime});
    }

    useEffect(() => {
      // console.log('loading metadata for ', artifacts.toHexString());
      const parsedMetadata = parseMetadata(artifacts);
      if(parsedMetadata !== null) {
        setParsedMd(parsedMetadata);
        mergeImages(parsedMetadata.images).then(async(b64) => {
          const file = dataURLtoFile(b64, 'nft.png');
          await uploadNFT(file, parsedMetadata);
          setImageBase64(b64);
        });
      }
    }, [artifacts])

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
          src={tokenId > 0 && imageBase64 !== '' ? imageBase64 : './images/uploadipfs.jpg'}
          alt="Unboxed NFT"
        />

        {nftMetadata.ipnft === '' || parsedMd === null ? '' :
        <Box mt={5} mb={5} fontSize="md" color="gray.600">
          <Text>TokenId: #{tokenId}</Text>
          <Text>Level: {parsedMd.level}</Text>
          <Text>Exp: {parsedMd.experience}</Text>
          <Text>Rarity: {parsedMd.rarity}</Text>
          <Text>Artifacts: {artifacts.toHexString()}</Text>
          {/* <Text>DNA: {dna}</Text> */}
          <Text>IPFS Cid: {nftMetadata.ipnft}</Text>
          <Text>Metadata: <a href={nftMetadata.url} target="_blank">{nftMetadata.url.substr(0, 20) + "..." + nftMetadata.url.substr(nftMetadata.url.length - 20, 20)}</a></Text>
        </Box>
        }
      </Box>
    </Flex>
  );
};

export default UnboxModal;