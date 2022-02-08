import React from "react";
import Home from "views/Home";
import Mint from "views/Mint";
import Marketplace from "views/Marketplace"
import Account from "views/Account";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/mint" element={<Mint />}/>
          <Route path="/marketplace" element={<Marketplace />}/>
          <Route path="/account" element={<Account />}/>
        </Routes>
    </Router>
  );
}

export default App;
