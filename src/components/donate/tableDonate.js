import React, { useState,   useEffect } from "react";
import { ethers } from "ethers";
import { useDonate } from "contexts/DonateContext";

import {
    Table,
    Tbody,
    Tr,
    Td,
} from '@chakra-ui/react'



export default function TableDonate(){
    const {donateData} = useDonate()
    console.log(donateData);
    return (
        <Table variant='simple'>
          <Tbody>
            <Tr>
              <Td>Genesis:</Td>
              <Td></Td>            
            </Tr>
            <Tr>
              <Td>TGE Amount:</Td>
              <Td></Td>
             
            </Tr>
            <Tr>
              <Td>Cliff:</Td>
              <Td></Td>
              {/* <Td>{ `from: ${data.genesisTimestamp} to ${data.genesisTimestamp + data.cliff}`}</Td> */}
              
            </Tr>
            <Tr>
              <Td>Duration:</Td>
              <Td></Td>
              {/* <Td>{ `from: ${data.genesisTimestamp} to ${data.genesisTimestamp + data.cliff + data.duration}`}</Td> */}
              
            </Tr>
            <Tr>
              <Td> Start:</Td>
              <Td>metres (m)</Td>
              
            </Tr>
            <Tr>
              <Td> End:</Td>
              <Td>metres (m)</Td>
              
            </Tr>
            <Tr>
              <Td> Higest:</Td>
              <Td>metres (m)</Td>
              
            </Tr>
            <Tr>
              <Td> Lowest:</Td>
              <Td>metres (m)</Td>
              
            </Tr>
            <Tr>
              <Td> Allow redeem:</Td>
              <Td>metres (m)</Td>
              
            </Tr>
            <Tr>
              <Td>Accept donamtion :</Td>
              <Td>metres (m)</Td>
              
            </Tr>
            <Tr>
              <Td>Price table</Td>
              <Td></Td>
              
            </Tr>
            <Tr>
              <Td>Cap:</Td>
              <Td>metres (m)</Td>
              
            </Tr>
          </Tbody>
        </Table>
      )
    }