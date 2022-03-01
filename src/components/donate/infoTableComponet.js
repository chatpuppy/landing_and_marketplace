import { useDonate } from "contexts/DonateContext";
import { DateTime } from "luxon";
import { ethers } from "ethers";
import { TOKEN_ADDRESS, TOKEN_VESTING_ADDRESS } from "constants";

import { 
    Box,
    Heading,
    TabPanels,
    Tab, 
    TabPanel,
    TabList,
    Tabs,
    Table,
    Tbody,
    Tr,
    Td,
    NumberInput,
    useColorModeValue
  } from '@chakra-ui/react'

export const InfoTableComponent = () => { 
  const { donateData } = useDonate()
  let data = donateData;
  
  const genesisTimestamp = DateTime.fromSeconds(parseInt(data.genesisTimestamp)).toFormat("F");
  const cliffTimeStamp = DateTime.fromSeconds(parseInt(data.genesisTimestamp) + parseInt(data.cliff)).toFormat("F");
  const startTime = DateTime.fromSeconds(parseInt(data.startTimestamp)).toFormat("F");
  const endTime = DateTime.fromSeconds(parseInt(data.endTimestamp)).toFormat("F");
  const endDuration = DateTime.fromSeconds(parseInt(data.genesisTimestamp) + parseInt(data.cliff) + parseInt(data.duration)).toFormat("F");

  const tgeAmount = data.tgeAmountRatio.div(100) + "%";

  const eraBasis = data.eraBasis.div(3600).toString();
  const higest = ethers.utils.formatEther(data.highest);
  const lowest = ethers.utils.formatEther(data.lowest);

  return (
    <Box>
    <Heading fontSize="2xl" align="left" ml={12} mb={5} mt={5} color={useColorModeValue('black.700', '#dcdcdc')}>
      Donation rules
    </Heading>

    <Table ml={"5%"} mr={"5%"} width={"90%"} mb={8} variant="simple" color={useColorModeValue('black.700', '#dcdcdc')}>
      <Tbody>
        <Tr>
          <Td>Donate start</Td>
          <Td>{startTime}</Td>
        </Tr>
        <Tr>
          <Td>Donate end</Td>
          <Td>{endTime}</Td>
        </Tr>
        <Tr>
          <Td>Genesis time</Td>
          <Td>{genesisTimestamp}</Td>
        </Tr>
        <Tr>
          <Td>Cliff</Td>
          <Td>{data.cliff == 0 ? `NO` : `${genesisTimestamp} to ${cliffTimeStamp}`}</Td>
        </Tr>
        <Tr>
          <Td>Release duration</Td>
          <Td>{`${cliffTimeStamp} to ${endDuration}`}</Td>
        </Tr>
        <Tr>
          <Td>TGE radio</Td>
          <Td>{tgeAmount}</Td>
        </Tr>
        <Tr>
          <Td>Era period</Td>
          <Td> {eraBasis + " " + (eraBasis > 1 ? 'hours' : 'hour')} </Td>
        </Tr>
        <Tr>
          <Td>Donation amount</Td>
          <Td>{lowest} to {higest} BNB</Td>
        </Tr>
        <Tr>
          <Td>Redeem allowd</Td>
          <Td>{data.allowRedeem ? "true" : "false"}</Td>
        </Tr>
        <Tr>
          <Td>Over cap allowed</Td>
          <Td>{data.acceptOverCap ? "true" : "false"}</Td>
        </Tr>
        <Tr>
          <Td>CPT address</Td>
          <Td>{TOKEN_ADDRESS}</Td>
        </Tr>
        <Tr>
          <Td>Vesting contract</Td>
          <Td>{TOKEN_VESTING_ADDRESS}</Td>
        </Tr>
      </Tbody>
    </Table>
    </Box>
  );
};
