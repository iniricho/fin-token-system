require("dotenv").config();

function getNetworkConfig() {
  const isMainnet = process.argv.includes("--mainnet");

  return {
    name: isMainnet ? "mainnet" : "sepolia",
    rpcUrl: isMainnet ? process.env.RPC_MAINNET : process.env.RPC_SEPOLIA,
    chainId: isMainnet
      ? parseInt(process.env.CHAIN_ID_MAINNET)
      : parseInt(process.env.CHAIN_ID_SEPOLIA),
    contract: isMainnet
      ? process.env.CONTRACT_ADDRESS_MAINNET
      : process.env.CONTRACT_ADDRESS_SEPOLIA,
  };
}

module.exports = { getNetworkConfig };
