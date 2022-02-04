import React from 'react';
import NavBar from 'components/NavBar';
import Footer from 'components/Footer';
import Hero from 'components/home/Hero';
import Mail from 'components/home/Mail';
import FeaturesGrid from 'components/home/FeaturesGrid';
import FeaturesList from 'components/home/FeaturesList';
import FeaturesImage from 'components/home/FeaturesImage';
import FeaturesLeftRight from 'components/home/FeaturesLeftRight';

export default function Home() {
  return (
    <>
        <NavBar />
        <Hero />
        <FeaturesLeftRight />    
        <FeaturesImage />    
        <FeaturesGrid />
        <FeaturesList />
        <Mail />
        <Footer />
    </>
  )
  ;
}
