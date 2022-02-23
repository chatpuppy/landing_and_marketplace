import React from 'react';
import ReactDOM from 'react-dom';
import App from 'App';
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { AuthProvider } from "contexts/AuthContext";
import { DonateProvider } from 'contexts/DonateContext';

const theme = extendTheme({
  colors: {
    brand: {
      100: "#16318a",
      200: "#204ad4"
    },
  },
  config: {
    initialColorMode: 'dark',
  }
})

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <DonateProvider>
        <App />
        </DonateProvider>
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

