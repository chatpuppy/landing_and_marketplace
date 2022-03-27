/**
 * BSC testnet
 */
export const TOKEN_VESTING_ADDRESS = "0xF886e6336f752F7c4aA496c33A5F77079fcc7a0E";

export const supportedChainIds = [97, 80001];

export const netWorkConfig = [{
		chainId: 97,
		chainName: 'Bsc Testnet',
		supportChainlinkVRFV2: true,
		tokenVestingAddress: '0xF886e6336f752F7c4aA496c33A5F77079fcc7a0E',
		paymentTokens: [{
			// The main token CPT must be the first
			address: '0x6adb30205dd2D2902f32E40e0f2CE15c728F9492',
			symbol: 'CPT',
		}],
		nftTokenAddress: '0x87Be7a62d608d29003ec1Ec292F65Df3913C8E34',
		nftManagerAddress: '0xd3eE8844847403a3160A4b1a9322F5CdebDF7F4c',
		nftManagerV2Address: '0x2c192A66eB075Ae1D93C15e38eCD5a0673d32168',
		marketplaceAddress: '0x22e42fea04f12de858Ce807FE863227486dCE9c3',
		etherscanBaseUrl: 'https://testnet.bscscan.com/address/',
		tokenName: 'tBNB',
		unboxMaxWaitingSeconds: 20,
	}, {
		chainId: 80001,
		chainName: 'Mumbai',
		supportChainlinkVRFV2: false,
		tokenVestingAddress: '',
		paymentTokens: [{
			// The main token CPT must be the first
			address: '0x5F9d7Dc9e56f7d182f3eFb1b48874C0512b4c40d',
			symbol: 'CPT',
		}, {
			address: '0xf2c3816181dCFb969E99f1Bd5aF03c6F6bd4e9d5',
			symbol: 'CPT1',
		}, {
			address: '0xc517b043a398EcD3cFB4b4A476837743b2Cb9e69',
			symbol: 'CPT2',
		}, {
			address: '0xb5b73661407f1b41c628bb806725d9629a466109',
			symbol: 'CPT3'
		}],
		nftTokenAddress: '0xA28D90320005C8c043Ee79ae59e82fDd5f983f30',
		nftManagerAddress: '0xCCAcc7F68bC4498CeA4Ee4D71e0AC0d824ca4513',
		nftManagerV2Address: '', // polygon not support v2
		marketplaceAddress: '0x206d806872E78e70Ef6ed7Df24983b6bB378eB87',
		etherscanBaseUrl: 'https://mumbai.polygonscan.com/address/',
		tokenName: 'MATIC',
		unboxMaxWaitingSeconds: 120,
	}
];

export const getNetworkConfig = (chainId) => 
	netWorkConfig.filter((item) => parseInt(item.chainId) === parseInt(chainId))[0];

export const supportedNetworks = () => 
	netWorkConfig.filter((item) => supportedChainIds.includes(parseInt(item.chainId)));

export const supportedChainNames = () => 
	supportedNetworks().map((item, index) => item.chainName);

export const NFT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGM3OGQ3MUI0RkNjMjljREE3YWIwY0Q0OGUxYTg4YWVmNThBRDVFMzMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0NzUyNzA5MDEwNiwibmFtZSI6ImNoYXRwdXBweSJ9.o51hr6ZaBEL0xq6DgSyGtqV_OgL7QF8tqq-d5Q0Fcjg';
export const NFT_DESCRIPTION = 'ChatPuppy, a group of NFTs of official chatpuppy peer-to-peer and wallet-to-wallet messeging Dapp. The owners of ChatPuppies can show the NFT as avatar in the messenger and get super functions.';
export const NFT_NAME = 'ChatPuppy NFT';
export const TOKEN_SYMBOL = 'CPT';

