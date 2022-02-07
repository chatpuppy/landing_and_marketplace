import React from 'react';
import ReactDOM from 'react-dom';
import App from 'App';
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { AuthProvider } from "contexts/AuthContext";

const theme = extendTheme({
  colors: {
    brand: {
      100: "#16318a",
    },
  },
})

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

