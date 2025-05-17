require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
console.log("→ RPC_SEPOLIA =", process.env.RPC_SEPOLIA);

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.RPC_SEPOLIA,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      url: process.env.RPC_MAINNET,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
