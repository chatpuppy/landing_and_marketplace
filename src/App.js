import React, { useEffect, useState } from "react";
import Home from "views/Home";
import Mint from "views/Mint";
import Marketplace from "views/Marketplace"
import Account from "views/Account";
import Donate from "views/Donate";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
// import { tokenVestingContract } from "./utils/tokenVestingsInteract";
import './App.css'

function App() {
	// const [component, setComponent] = useState({path: '/', comp: <Home/>});
  const { 
    setCurrentAccount, 
    setCurrentNetwork, 
    // setTokenVestingContract 
  } = useAuth()
  
  useEffect(() => {
    const initialCheck = async() => {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setCurrentNetwork(parseInt(chainId, 16))
				const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) setCurrentAccount(accounts[0]);

        window.ethereum.on('accountsChanged', function (accounts) {
          // Time to reload your interface with accounts[0]!
					console.log("accounts", accounts[0])
          setCurrentAccount(accounts[0]);
          window.location.reload()
        })
        
        window.ethereum.on('chainChanged', function (chainId) {
          // Time to reload your interface with the new chainId
          setCurrentNetwork(parseInt(chainId, 16))
          window.location.reload()
        })

      } catch(err) {
        console.log(err)
      }
    }
    initialCheck();
		// setComponent(getApp());
  }, [setCurrentAccount, setCurrentNetwork]);

  // useEffect(() => {
  //   async function initTokenVesting() {
  //     const response = await tokenVestingContract;
  //     setTokenVestingContract(response);
  //   }
  //   initTokenVesting()
  // })
	// function subdomainApplications (map) {
	// 	let main = map.find((item)=> item.main);
	// 	if (!main) {
	// 		throw new Error('Must set main flag to true on at least one subdomain app');
	// 	}
	
	// 	return function getComponent () {
	// 		const parts = window.location.hostname.split('.');
	// 		const paths = window.location.pathname.split('/');
	
	// 		let last_index = -2;
	// 		const last = parts[parts.length - 1];
	// 		const is_localhost = last === 'localhost';
	// 		if (is_localhost) {
	// 			last_index = -1;
	// 		}
	
	// 		const subdomain = parts.slice(0, last_index).join('.');
	// 		const _path = paths[1] === '' ? '/account' : '/' + paths[1];
	
	// 		if (!subdomain) {
	// 			return main.application;
	// 		}
	
	// 		const app = map.find(({subdomains, paths})=> subdomains.includes(subdomain) && paths.includes(_path));
	// 		console.log(app.application)
	// 		if (app) {
	// 			return app.application;
	// 		} else {
	// 			return main.application;
	// 		}
	// 	}
	// }

	// const getApp = subdomainApplications([
	// 	{
	// 		subdomains: ['www'],
	// 		paths: ['/'],
	// 		application: function () {
	// 			return {path: '/', app: <Home />};
	// 		},
	// 		main: true
	// 	},{
	// 		subdomains: ['dao'],
	// 		paths: ['/donate'],
	// 		application: function () {
	// 			return {path: '/donate', app: <Donate />};
	// 		},
	// 	},{
	// 		subdomains: ['nft'],
	// 		paths: ['/mint'],
	// 		application: function () {
	// 			return {path: '/mint', app: <Mint />};
	// 		}
	// 	}, {
	// 		subdomains: ['nft'],
	// 		paths: ['/marketplace'],
	// 		application: function () {
	// 			return {path: '/marketplace', app: <Marketplace />};
	// 		}
	// 	}, {
	// 		subdomains: ['nft'],
	// 		paths: ['/account'],
	// 		application: function () {
	// 			return {path: '/account', app: <Account />};
	// 		}
	// 	}
	// ]);
  
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/mint" element={<Mint />}/>
          <Route path="/marketplace" element={<Marketplace />}/>
          <Route path="/account" element={<Account />}/>
          <Route path="/donate" element={<Donate />}/>
					{/* <Route path={component.path} element={component.app} /> */}
        </Routes>
    </Router>
  );
}

export default App;
