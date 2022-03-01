import { useDonate } from "contexts/DonateContext";
import { DateTime } from "luxon";
import { ethers } from "ethers";

import { 
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
  console.log(data.genesisTimestamp.toString())
  
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
    <Table variant="simple" color={useColorModeValue('black.700', 'grey')}>
      <Tbody>
        <Tr>
          <Td>Donate Start</Td>
          <Td>{startTime}</Td>
        </Tr>
        <Tr>
          <Td>Donate End</Td>
          <Td>{endTime}</Td>
        </Tr>
        <Tr>
          <Td>Genesis Time</Td>
          <Td>{genesisTimestamp}</Td>
        </Tr>
        <Tr>
          <Td>Cliff</Td>
          <Td>{data.cliff == 0 ? `NO` : `${genesisTimestamp} to ${cliffTimeStamp}`}</Td>
        </Tr>
        <Tr>
          <Td>Release Duration</Td>
          <Td>{`${cliffTimeStamp} to ${endDuration}`}</Td>
        </Tr>
        <Tr>
          <Td>TGE Radio</Td>
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
          <Td>{data.allowRedeem ? "True" : "False"}</Td>
        </Tr>
        <Tr>
          <Td>Over cap allowed</Td>
          <Td>{data.acceptOverCap ? "True" : "False"}</Td>
        </Tr>
      </Tbody>
    </Table>
  );
};
