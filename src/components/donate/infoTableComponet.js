import React, { useEffect, useState } from 'react';
import { useDonate } from 'contexts/DonateContext';
import { DateTime } from 'luxon';
import { ethers } from 'ethers';
import {
  TOKEN_VESTING_ADDRESS,
  CPT_TOKEN_ADDRESS,
  SCAN_BASE_URL,
} from 'constants';
import { ExternalLinkIcon } from '@chakra-ui/icons';

import {
  Box,
  Heading,
  Table,
  Tbody,
  Tr,
  Td,
  useColorModeValue,
} from '@chakra-ui/react';

export const InfoTableComponent = () => {
  const { donateData } = useDonate();
  // if(donateData === undefined) return (<></>);
  const [donateDataObj, setDonateDataObj] = useState(null);

  useEffect(() => {
    if (donateData === undefined) return;
    const genesisTimestamp = DateTime.fromSeconds(
      parseInt(donateData.genesisTimestamp)
    ).toFormat('F');
    const cliffTimeStamp = DateTime.fromSeconds(
      parseInt(donateData.genesisTimestamp) + parseInt(donateData.cliff)
    ).toFormat('F');
    const startTime = DateTime.fromSeconds(
      parseInt(donateData.startTimestamp)
    ).toFormat('F');
    const endTime = DateTime.fromSeconds(
      parseInt(donateData.endTimestamp)
    ).toFormat('F');
    const endDuration = DateTime.fromSeconds(
      parseInt(donateData.genesisTimestamp) +
        parseInt(donateData.cliff) +
        parseInt(donateData.duration)
    ).toFormat('F');
    const tgeAmount = donateData.tgeAmountRatio.div(100) + '%';
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
    });
  }, [donateData]);

  return (
    <Box pb={8} mb={5}>
      <Heading
        fontSize="2xl"
        align="left"
        ml={10}
        mt={5}
        p={5}
        color={useColorModeValue('black.700', '#dcdcdc')}
        textTransform={'uppercase'}>
        DONATION RULES
      </Heading>

      <Table
        ml={'5%'}
        mr={'5%'}
        width={'90%'}
        variant="simple"
        color={useColorModeValue('black.700', '#dcdcdc')}
        wordBreak={'break-word'}
        fontSize={'sm'}
        textTransform={'uppercase'}>
        {donateDataObj === null ? (
          <></>
        ) : (
          <Tbody>
            <Tr>
              <Td>{'Token address'}</Td>
              <Td textTransform={'none'}>
                <a
                  href={SCAN_BASE_URL + CPT_TOKEN_ADDRESS}
                  target="_blank"
                  rel="noreferrer">
                  {CPT_TOKEN_ADDRESS + ' '}
                  <ExternalLinkIcon />
                </a>
              </Td>
            </Tr>
            <Tr>
              <Td>{'Vesting contract'}</Td>
              <Td textTransform={'none'}>
                <a
                  href={SCAN_BASE_URL + TOKEN_VESTING_ADDRESS}
                  target="_blank"
                  rel="noreferrer">
                  {TOKEN_VESTING_ADDRESS + ' '}
                  <ExternalLinkIcon />
                </a>
              </Td>
            </Tr>
            <Tr>
              <Td>{'Donate duration'}</Td>
              <Td>
                {donateDataObj.startTime} - {donateDataObj.endTime}
              </Td>
            </Tr>
            <Tr>
              <Td>{'Genesis time'}</Td>
              <Td>{donateDataObj.genesisTimestamp}</Td>
            </Tr>
            <Tr>
              <Td>{'Cliff'}</Td>
              <Td>
                {donateData === undefined
                  ? ''
                  : donateData.cliff === 0
                  ? `NO`
                  : `${donateDataObj.genesisTimestamp} - ${donateDataObj.cliffTimeStamp}`}
              </Td>
            </Tr>
            <Tr>
              <Td>{'Claim duration'}</Td>
              <Td>{`${donateDataObj.cliffTimeStamp} - ${donateDataObj.endDuration}`}</Td>
            </Tr>
            <Tr>
              <Td>{'TGE radio'}</Td>
              <Td>{donateDataObj.tgeAmount}</Td>
            </Tr>
            <Tr>
              <Td>{'Era period'}</Td>
              <Td>
                {' '}
                {donateDataObj.eraBasis +
                  ' ' +
                  (donateDataObj.eraBasis > 1 ? 'hours' : 'hour')}{' '}
              </Td>
            </Tr>
            <Tr>
              <Td>{'Donation amount'}</Td>
              <Td>
                {donateDataObj.lowest} - {donateDataObj.higest} BNB
              </Td>
            </Tr>
            <Tr>
              <Td>{'Redeem allowd'}</Td>
              <Td>
                {donateData === undefined
                  ? ''
                  : donateData.allowRedeem
                  ? 'true'
                  : 'false'}
              </Td>
            </Tr>
            <Tr>
              <Td>{'Over cap allowed'}</Td>
              <Td>
                {donateData === undefined
                  ? ''
                  : donateData.acceptOverCap
                  ? 'true'
                  : 'false'}
              </Td>
            </Tr>
            {/* <Tr>
          <Td>{"CPT address"}</Td>
          <Td>{TOKEN_ADDRESS}</Td>
        </Tr> */}
          </Tbody>
        )}
      </Table>
    </Box>
  );
};
