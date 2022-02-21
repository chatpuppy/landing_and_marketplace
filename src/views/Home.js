import React from 'react';
import NavBar from 'components/NavBar';
import Footer from 'components/Footer';
import Hero from 'components/home/Hero';
import Mail from 'components/home/Mail';
import FeaturesGrid from 'components/home/FeaturesGrid';
import FeaturesLeftRight from 'components/home/FeaturesLeftRight';
import FeaturesBox from 'components/home/FeaturesBox';

export default function Home() {
  return (
    <>
        <NavBar />
        <Hero />
        <FeaturesLeftRight />
        <FeaturesGrid />
        <FeaturesBox />
        <Mail />
        <Footer />
    </>
  )
  ;
}
