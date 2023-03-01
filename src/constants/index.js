/**
 * BSC testnet
 */
// export const TOKEN_VESTING_ADDRESS = "0x6Ca49e6fF9278c981734293cb077Af8198d125Ae";
// export const CPT_TOKEN_ADDRESS = "0x6adb30205dd2D2902f32E40e0f2CE15c728F9492";
// export const CHAIN_ID = 97;

/**
 * BSC mainnet
 */
// export const TOKEN_VESTING_ADDRESS = '0x41Aacd3cF89235EB40757964A702d8A199dF81b0'; // updated on 4-25
export const TOKEN_VESTING_ADDRESS =
  '0x262cb17aa9c8cdf91721f80976f73d278498cdd9'; // updated on 4-30
export const CPT_TOKEN_ADDRESS = '0xa747Ba9BbF79E165Cd71c4376B72eBc06CA735CB';
export const CHAIN_ID = 56;

export const SCAN_BASE_URL = 'https://bscscan.com/address/';

export const supportedChainIds = [1, 56, 80001];

export const netWorkConfig = [
  {
    chainId: 1,
    chainName: 'Ethereum',
    supportChainlinkVRFV2: true,
    tokenVestingAddress: '',
    paymentTokens: [
      {
        // The main token CPT must be the first
      },
    ],
    nftTokenAddress: '0xf81ea6f30c06D3cf037b33334Fe31aDE682E6574',
    nftManagerAddress: '',
    nftManagerV2Address: '0x957E97a5b25f26DD5b3792F4d6d5cb492501B90e',
    marketplaceAddress: '',
    etherscanBaseUrl: 'https://etherscan.io/address/',
    tokenName: 'ETH',
    unboxMaxWaitingSeconds: 180,
    confirmationNumbers: 1,
    buttons: {
      sell: {
        url: 'https://opensea.io/assets/',
        label: 'Sell on Opensea',
        visible: true,
      },
      unlist: {
        url: null,
        label: 'Unlist',
        visible: false,
      },
      updatePrice: {
        url: null,
        label: 'Update Price',
        visible: false,
      },
      buy: {
        url: null,
        label: 'Buy',
        visible: false,
      },
      marketplaceMenu: {
        url: 'https://opensea.io/collection/chatpuppy',
        label: 'Marketplace',
        visible: true,
      },
      mintMenu: {
        url: '/mint',
        label: 'Mint',
        visible: true,
      },
      accountMenu: {
        url: '/account',
        label: 'Account',
        visible: true,
      },
      governanceMenu: {
        url: 'https://snapshot.org/#/chatpuppy.eth',
        // url: "/governance",
        label: 'Governance',
        visible: true,
      },
      donateMenu: {
        url: '/donate',
        label: 'Donate',
        visible: false,
      },
      bridgeMenu: {
        url: 'https://portalbridge.com/#/nft',
        label: 'Send NFT to BSC',
        visible: true,
      },
      mint: {
        url: null,
        label: 'Mint',
        visible: true,
      },
      unbox: {
        uri: null,
        label: 'Unbox',
        visible: true,
      },
    },
  },
  {
    chainId: 56,
    chainName: 'Binance Smart Chain',
    supportChainlinkVRFV2: true,
    tokenVestingAddress: '',
    paymentTokens: [
      {
        // The main token CPT must be the first
        address: '0xa747Ba9BbF79E165Cd71c4376B72eBc06CA735CB',
        symbol: 'CPT',
      },
    ],
    nftTokenAddress: '0x4F3402D05822E435C27D1B80aee6edD639E681d7',
    nftManagerAddress: '',
    nftManagerV2Address: '',
    marketplaceAddress: '0xb7a8eBbB8f57ffCBDC2230F2b1C34CFA4Bf22D45',
    etherscanBaseUrl: 'https://bscscan.com/address/',
    tokenName: 'BNB',
    unboxMaxWaitingSeconds: 90,
    confirmationNumbers: 1,
    buttons: {
      sell: {
        url: null,
        label: 'Sell',
        visible: true,
      },
      unlist: {
        url: null,
        label: 'Unlist',
        visible: true,
      },
      updatePrice: {
        url: null,
        label: 'Update Price',
        visible: true,
      },
      buy: {
        url: null,
        label: 'Buy',
        visible: true,
      },
      marketplaceMenu: {
        url: '/marketplace',
        label: 'Marketplace',
        visible: false,
      },
      mintMenu: {
        url: '/mint',
        label: 'Mint',
        visible: false,
      },
      accountMenu: {
        url: '/account',
        label: 'Account',
        visible: false,
      },
      governanceMenu: {
        url: 'https://snapshot.org/#/chatpuppy.eth',
        label: 'Governance',
        visible: false,
      },
      donateMenu: {
        url: '/donate',
        label: 'Donate',
        visible: true,
      },
      bridgeMenu: {
        url: 'https://portalbridge.com/#/nft',
        label: 'Send NFT to Ethereum',
        visible: false,
      },
      mint: {
        url: null,
        label: 'Mint',
        visible: false,
      },
      unbox: {
        uri: null,
        label: 'Unbox',
        visible: false,
      },
    },
  },
  {
    chainId: 4,
    chainName: 'Rinkeby',
    supportChainlinkVRFV2: true,
    tokenVestingAddress: '',
    paymentTokens: [
      {
        // The main token CPT must be the first
      },
    ],
    nftTokenAddress: '0x18A1e002958EbAc355102ec84fCbc24C7957B001',
    nftManagerAddress: '',
    nftManagerV2Address: '0x8563e3352cf9dc00559ba4f80c112ef083a26543',
    marketplaceAddress: '',
    etherscanBaseUrl: 'https://rinkeby.etherscan.io/address/',
    tokenName: 'ETH',
    unboxMaxWaitingSeconds: 120,
    confirmationNumbers: 1,
    buttons: {
      sell: {
        url: null,
        label: 'Sell',
        visible: true,
      },
      unlist: {
        url: null,
        label: 'Unlist',
        visible: true,
      },
      updatePrice: {
        url: null,
        label: 'Update Price',
        visible: true,
      },
      buy: {
        url: null,
        label: 'Buy',
        visible: true,
      },
      marketplaceMenu: {
        url: '/marketplace',
        label: 'Marketplace',
        visible: true,
      },
      mintMenu: {
        url: '/mint',
        label: 'Mint',
        visible: true,
      },
      accountMenu: {
        url: '/account',
        label: 'Account',
        visible: true,
      },
      governanceMenu: {
        url: 'https://snapshot.org/#/chatpuppy.eth',
        label: 'Governance',
        visible: true,
      },
      donateMenu: {
        url: '/donate',
        label: 'Donate',
        visible: false,
      },
      bridgeMenu: {
        url: 'https://portalbridge.com/#/nft',
        label: 'Wormhold Bridge',
        visible: false,
      },
      mint: {
        url: null,
        label: 'Mint',
        visible: true,
      },
      unbox: {
        uri: null,
        label: 'Unbox',
        visible: true,
      },
    },
  },
  {
    chainId: 97,
    chainName: 'Bsc Testnet',
    supportChainlinkVRFV2: true,
    tokenVestingAddress: '0xeF6eDD351a233B347abDc8d272222ae09EFdc491',
    paymentTokens: [
      {
        // The main token CPT must be the first
        address: '0x6adb30205dd2D2902f32E40e0f2CE15c728F9492',
        symbol: 'CPT',
      },
    ],
    nftTokenAddress: '0x2c0AAB23e0fC64629623B48Bf9ab1C3a64860A41',
    nftManagerAddress: '',
    nftManagerV2Address: '0x598C8f63F3B15033b17e49f67621dee5C865417A',
    marketplaceAddress: '0x22e42fea04f12de858Ce807FE863227486dCE9c3',
    etherscanBaseUrl: 'https://testnet.bscscan.com/address/',
    tokenName: 'tBNB',
    unboxMaxWaitingSeconds: 20,
    confirmationNumbers: 2,
    buttons: {
      sell: {
        url: null,
        label: 'Sell',
        visible: true,
      },
      unlist: {
        url: null,
        label: 'Unlist',
        visible: true,
      },
      updatePrice: {
        url: null,
        label: 'Update Price',
        visible: true,
      },
      buy: {
        url: null,
        label: 'Buy',
        visible: true,
      },
      marketplaceMenu: {
        url: '/marketplace',
        label: 'Marketplace',
        visible: true,
      },
      mintMenu: {
        url: '/mint',
        label: 'Mint',
        visible: true,
      },
      accountMenu: {
        url: '/account',
        label: 'Account',
        visible: true,
      },
      governanceMenu: {
        url: 'https://snapshot.org/#/chatpuppy.eth',
        label: 'Governance',
        visible: true,
      },
      donateMenu: {
        url: '/donate',
        label: 'Donate',
        visible: true,
      },
      bridgeMenu: {
        url: 'https://portalbridge.com/#/nft',
        label: 'Wormhold Bridge',
        visible: false,
      },
      mint: {
        url: null,
        label: 'Mint',
        visible: true,
      },
      unbox: {
        uri: null,
        label: 'Unbox',
        visible: true,
      },
    },
  },
  {
    chainId: 80001,
    chainName: 'Mumbai',
    supportChainlinkVRFV2: false,
    tokenVestingAddress: '',
    paymentTokens: [
      {
        // The main token CPT must be the first
        address: '0x5F9d7Dc9e56f7d182f3eFb1b48874C0512b4c40d',
        symbol: 'CPT',
      },
      {
        address: '0xf2c3816181dCFb969E99f1Bd5aF03c6F6bd4e9d5',
        symbol: 'CPT1',
      },
      {
        address: '0xc517b043a398EcD3cFB4b4A476837743b2Cb9e69',
        symbol: 'CPT2',
      },
      // {
      // 	address: '0xb5b73661407f1b41c628bb806725d9629a466109',
      // 	symbol: 'CPT3'
      // }
    ],
    nftTokenAddress: '0xA28D90320005C8c043Ee79ae59e82fDd5f983f30',
    nftManagerAddress: '0xCCAcc7F68bC4498CeA4Ee4D71e0AC0d824ca4513',
    nftManagerV2Address: '', // polygon not support v2
    marketplaceAddress: '0x206d806872E78e70Ef6ed7Df24983b6bB378eB87',
    etherscanBaseUrl: 'https://mumbai.polygonscan.com/address/',
    tokenName: 'MATIC',
    unboxMaxWaitingSeconds: 120,
    confirmationNumbers: 1,
    buttons: {
      sell: {
        url: null,
        label: 'Sell',
        visible: true,
      },
      unlist: {
        url: null,
        label: 'Unlist',
        visible: true,
      },
      updatePrice: {
        url: null,
        label: 'Update Price',
        visible: true,
      },
      buy: {
        url: null,
        label: 'Buy',
        visible: true,
      },
      marketplaceMenu: {
        url: '/marketplace',
        label: 'Marketplace',
        visible: true,
      },
      mintMenu: {
        url: '/mint',
        label: 'Mint',
        visible: true,
      },
      accountMenu: {
        url: '/account',
        label: 'Account',
        visible: true,
      },
      governanceMenu: {
        url: 'https://snapshot.org/#/chatpuppy.eth',
        label: 'Governance',
        visible: true,
      },
      donateMenu: {
        url: '/donate',
        label: 'Donate',
        visible: false,
      },
      bridgeMenu: {
        url: 'https://portalbridge.com/#/nft',
        label: 'Wormhold Bridge',
        visible: false,
      },
      mint: {
        url: null,
        label: 'Mint',
        visible: true,
      },
      unbox: {
        uri: null,
        label: 'Unbox',
        visible: true,
      },
    },
  },
];

export const getNetworkConfig = (chainId) =>
  netWorkConfig.filter(
    (item) => parseInt(item.chainId) === parseInt(chainId)
  )[0];

export const supportedNetworks = () =>
  netWorkConfig.filter((item) =>
    supportedChainIds.includes(parseInt(item.chainId))
  );

export const supportedChainNames = () =>
  supportedNetworks().map((item) => item.chainName);

export const NFT_STORAGE_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGM3OGQ3MUI0RkNjMjljREE3YWIwY0Q0OGUxYTg4YWVmNThBRDVFMzMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0NzUyNzA5MDEwNiwibmFtZSI6ImNoYXRwdXBweSJ9.o51hr6ZaBEL0xq6DgSyGtqV_OgL7QF8tqq-d5Q0Fcjg';
export const NFT_DESCRIPTION =
  'ChatPuppy, a group of NFTs of official chatpuppy peer-to-peer and wallet-to-wallet messeging Dapp. The owners of ChatPuppies can show the NFT as avatar in the messenger and get super functions.';
export const NFT_NAME = 'ChatPuppy NFT';
export const TOKEN_SYMBOL = 'CPT';
export const API_BASE_URI = 'https://api.chatpuppy.com:8444/api/v1/';
