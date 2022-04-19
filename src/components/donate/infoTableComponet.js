import {useEffect, useState} from "react";
import { useDonate } from "contexts/DonateContext";
import { DateTime } from "luxon";
import { ethers } from "ethers";
import { TOKEN_VESTING_ADDRESS } from "constants";

import { 
    Box,
    Heading,
    Table,
    Tbody,
    Tr,
    Td,
    useColorModeValue
  } from '@chakra-ui/react'

export const InfoTableComponent = () => { 
  const { donateData } = useDonate()
	// if(donateData === undefined) return (<></>);	
	const [donateDataObj, setDonateDataObj] = useState(null);

	useEffect(() => {
		if(donateData === undefined) return;
		const genesisTimestamp = DateTime.fromSeconds(parseInt(donateData.genesisTimestamp)).toFormat("F");
		const cliffTimeStamp = DateTime.fromSeconds(parseInt(donateData.genesisTimestamp) + parseInt(donateData.cliff)).toFormat("F");
		const startTime = DateTime.fromSeconds(parseInt(donateData.startTimestamp)).toFormat("F");
		const endTime = DateTime.fromSeconds(parseInt(donateData.endTimestamp)).toFormat("F");
		const endDuration = DateTime.fromSeconds(parseInt(donateData.genesisTimestamp) + parseInt(donateData.cliff) + parseInt(donateData.duration)).toFormat("F");
		const tgeAmount = donateData.tgeAmountRatio.div(100) + "%";	
		const eraBasis = donateData.eraBasis.div(3600).toString();
		const higest = ethers.utils.formatEther(donateData.highest);
		const lowest = ethers.utils.formatEther(donateData.lowest);	

		setDonateDataObj({
			genesisTimestamp,
			cliffTimeStamp,
			startTime,
			endTime,
			endDuration,
			tgeAmount,
			eraBasis,
			higest,
			lowest,
		})
	}, [donateData]);

  return (
    <Box
			pb={8}
			mb={5} 
		>
    <Heading 
			fontSize="2xl" 
			align="left" 
			ml={10} 
			mt={5}
			p={5} 
			color={useColorModeValue('black.700', '#dcdcdc')}
		>
			DONATION RULES
    </Heading>

    <Table 
			ml={"5%"} 
			mr={"5%"} 
			width={"90%"} 
			variant="simple" 
			color={useColorModeValue('black.700', '#dcdcdc')}
			wordBreak={"break-word"}
			fontSize={"sm"}
		>
		{donateDataObj === null ? <></> :
      <Tbody>
        <Tr>
          <Td>{"Donate duration".toUpperCase()}</Td>
          <Td>{donateDataObj.startTime} - {donateDataObj.endTime}</Td>
        </Tr>
        <Tr>
          <Td>{"Genesis time".toUpperCase()}</Td>
          <Td>{donateDataObj.genesisTimestamp}</Td>
        </Tr>
        <Tr>
          <Td>{"Cliff".toUpperCase()}</Td>
          <Td>{donateData === undefined ? "" : donateData.cliff === 0 ? `NO` : `${donateDataObj.genesisTimestamp} - ${donateDataObj.cliffTimeStamp}`}</Td>
        </Tr>
        <Tr>
          <Td>{"Release duration".toUpperCase()}</Td>
          <Td>{`${donateDataObj.cliffTimeStamp} - ${donateDataObj.endDuration}`}</Td>
        </Tr>
        <Tr>
          <Td>{"TGE radio".toUpperCase()}</Td>
          <Td>{donateDataObj.tgeAmount}</Td>
        </Tr>
        <Tr>
          <Td>{"Era period".toUpperCase()}</Td>
          <Td> {donateDataObj.eraBasis + " " + (donateDataObj.eraBasis > 1 ? 'hours' : 'hour')} </Td>
        </Tr>
        <Tr>
          <Td>{"Donation amount".toUpperCase()}</Td>
          <Td>{donateDataObj.lowest} - {donateDataObj.higest} BNB</Td>
        </Tr>
        <Tr>
          <Td>{"Redeem allowd".toUpperCase()}</Td>
          <Td>{donateData === undefined ? "" : donateData.allowRedeem ? "true" : "false"}</Td>
        </Tr>
        <Tr>
          <Td>{"Over cap allowed".toUpperCase()}</Td>
          <Td>{donateData === undefined ? "" : donateData.acceptOverCap ? "true" : "false"}</Td>
        </Tr>
        {/* <Tr>
          <Td>{"CPT address".toUpperCase()}</Td>
          <Td>{TOKEN_ADDRESS}</Td>
        </Tr> */}
        <Tr>
          <Td>{"Vesting contract".toUpperCase()}</Td>
          <Td>{TOKEN_VESTING_ADDRESS}</Td>
        </Tr>
      </Tbody>}
    </Table>
    </Box>
  );
};
