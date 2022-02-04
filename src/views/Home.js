import React from 'react';
import NavBar from 'components/NavBar';
import Footer from 'components/Footer';
import Hero from 'components/home/Hero';
import Mail from 'components/home/Mail';
import FeaturesGrid from 'components/home/FeaturesGrid';
import FeaturesList from 'components/home/FeaturesList';

export default function Home() {
  return (
    <>
        <NavBar />
        <Hero />
        <FeaturesGrid />
        <FeaturesList />
        <Mail />
        <Footer />
    </>
  )
  ;
}
