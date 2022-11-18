import { ethers } from "ethers";
import web3modal from "utils/web3modal"

export const checkIfWalletIsConnected = async () => {
    const { ethereum } = window; //gets ethereum object from metamask injection
    if (!ethereum) {
        alert("Make sure you have metamask!");
        return;
    }
		console.log("checkIfWalletIsConnected")
    //gets list of accounts/addresses
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
        const account = accounts[0];
        return account;
    } else {
        console.log("No authorized account found")
    }
  }

export const connectWallet = async () => {
    const instance = await web3modal.connect();
		console.log("Connected to")
    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();
    return signer.getAddress();
}

