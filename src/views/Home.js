import React from 'react';
import NavBar from 'components/NavBar';
import Footer from 'components/Footer';
import Hero from 'components/home/Hero';
import Mail from 'components/home/Mail';
import FeaturesLeftRight from 'components/home/FeaturesLeftRight';
import FeaturesBox from 'components/home/FeaturesBox';
import SupportedNetworks from 'components/home/SupportedNetworks';
import Roadmap from "assets/roadmap.png"
import { Center, Image, chakra, useColorModeValue } from '@chakra-ui/react';

export default function Home() {
  return (
    <>
        <NavBar />
        <Hero />
        <FeaturesLeftRight />
        <SupportedNetworks />
        <FeaturesBox />
        <Center my="20">
          <chakra.p
                fontSize={{ base: "3xl", sm: "4xl" }}
                lineHeight="8"
                fontWeight="extrabold"
                letterSpacing="tight"
                color={useColorModeValue("gray.900")}
            >
                ROADMAP
          </chakra.p>
        </Center>
        <Image w="100vw" src={Roadmap} />
        <Mail />
        <Footer />
    </>
  )
  ;
}
