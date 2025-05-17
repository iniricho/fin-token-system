require("dotenv").config();
const { ethers } = require("ethers");
const { getNetworkConfig } = require("./getNetwork");
const abi = require("./contract-abi.json");

const config = getNetworkConfig();

const provider = new ethers.JsonRpcProvider(config.rpcUrl);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(config.contract, abi, wallet);

// Payload & signature dari Python
const payload = {
  cid: "Qm...",
  txCode: "TX123456",
  receiver: "0xReceiver",
  amount: 500000000,
  nonce: 1,
};

const signature = "0x..."; // hasil dari Python

async function main() {
  const tx = await contract.mintWithSig(payload, signature);
  console.log("TX Hash:", tx.hash);
  await tx.wait();
  console.log("✅ Minted with signature.");
}

main().catch(console.error);
