// import('hardhat/config').HardhatUserConfig 
// require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
      },
      {
        version: "0.8.17",
      }
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true
    },
    ropsten: {
      url: 'https://ropsten.infura.io/v3/90ae57e37549453cbad6b61c189b40f0',
      accounts: [`0x138e20e0eaa7c1ed6a01152b78e472ef29f4316c2fc0957160f1feb0c4eb4c90`, `0xa36385172210e096a360a564a7673da72b31f2b871bcb5ffad9ef93e68374d53`],
      chainId: 3,
      allowUnlimitedContractSize: true,
      blockGasLimit: 100000000429720
    },
  //   arbitrum: {
  //     url: process.env.ARBITRUM_MAINNET_RPC_URL,
  //     accounts: [`0x${process.env.PRIVATE_KEY}`, `0x${process.env.PRIVATE_KEY_ACCOUNT_2}`],
  //     chainId: 4,
  //     allowUnlimitedContractSize: true,
  //   },
  //   matic: {
  //     url: process.env.MUMBAI_TESTNET_RPC_URL,
  //     accounts: [`0x${process.env.PRIVATE_KEY}`, `0x${process.env.PRIVATE_KEY_ACCOUNT_2}`],
  //     chainId: 80001,
  //     allowUnlimitedContractSize: true,
  //   }
  // },
  // etherscan: {
  //   apiKey: {
  //     rinkeby: process.env.ETHER_SCAN_API_KEY,
  //   },
  // },
  // arbiscan: {
  //   apiKey: {
  //     arbitrum: process.env.ARBITRUM_SCAN_API_KEY,
  //   },
  },
  
};
