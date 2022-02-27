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

  const genesisTimestamp = new DateTime(
    ethers.utils.formatEther(data.genesisTimestamp)
  ).toISODate();
  const cliffTimeStamp = new DateTime(
    data.genesisTimestamp + data.cliff
  ).toISODate();
  const tgeAmount = ethers.utils.formatEther(data.tgeAmountRatio.div(100));
  const endDuration = new DateTime(
    data.genesisTimestamp + data.cliff + data.duration
  ).toISODate();
  const eraBasis = ethers.utils.formatEther(data.eraBasis);
  const startTime = new DateTime(data.startTimestamp).toISODate();
  const endTime = new DateTime(data.endTimestamp).toISODate();
  const higest = ethers.utils.formatEther(data.highest);
  const lowest = ethers.utils.formatEther(data.lowest);

  return (
    <Table variant="simple" color={useColorModeValue('black.700', 'black.700')}>
      <Tbody>
        <Tr>
          <Td>Genesis:</Td>
          <Td>{genesisTimestamp}</Td>
        </Tr>
        <Tr>
          <Td>TGE Amount:</Td>
          <Td>{tgeAmount}</Td>
        </Tr>
        <Tr>
          <Td>Cliff:</Td>
          <Td>{`from: ${genesisTimestamp} to ${cliffTimeStamp}`}</Td>
        </Tr>
        <Tr>
          <Td>Duration:</Td>
          <Td>{`from: ${genesisTimestamp} to ${endDuration}`}</Td>
        </Tr>
        <Tr>
          <Td> Era Basis:</Td>
          <Td> {eraBasis}</Td>
        </Tr>
        <Tr>
          <Td> Start:</Td>
          <Td>{startTime}</Td>
        </Tr>
        <Tr>
          <Td> End:</Td>
          <Td>{endTime}</Td>
        </Tr>
        <Tr>
          <Td> Higest:</Td>
          <Td>{higest}</Td>
        </Tr>
        <Tr>
          <Td> Lowest:</Td>
          <Td>{lowest}</Td>
        </Tr>
        <Tr>
          <Td> Allow redeem:</Td>
          <Td>{data.allowRedeem ? "True" : "False"}</Td>
        </Tr>
        <Tr>
          <Td>Accept donation:</Td>
          <Td>{data.acceptOverCap ? "True" : "False"}</Td>
        </Tr>
      </Tbody>
    </Table>
  );
};
