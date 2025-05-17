// oracle-js/mintFromFIN.js
require("dotenv").config();
const { ethers } = require("ethers");
const { getNetworkConfig } = require("./getNetwork"); // utility untuk pilih network
const abi = require("./contract-abi.json");

async function main() {
  // Pilih network berdasarkan argument --mainnet
  const config = getNetworkConfig();
  console.log(`🔗 Connecting to ${config.name} via`, config.rpcUrl);

  // Setup provider & wallet
  const provider = new ethers.JsonRpcProvider(config.rpcUrl);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Ambil instance kontrak
  const contract = new ethers.Contract(config.contract, abi, wallet);

  // Data yang ingin di-mint (ganti sesuai kebutuhan)
  const CID = "Qm..."; // CID file .fin di IPFS
  const txCode = "TX123456"; // Kode transaksi
  const receiver = "0xAbCdEf…"; // Alamat penerima
  const amount = ethers.parseUnits("1000", 18); // Jumlah token (mis: 1000 FINEURO)

  console.log("▶️ mintFromFIN:", {
    CID,
    txCode,
    receiver,
    amount: amount.toString(),
  });

  // Kirim transaksi mintFromFIN (onlyOwner)
  const tx = await contract.mintFromFIN(CID, txCode, receiver, amount);
  console.log("📮 TX hash:", tx.hash);

  // Tunggu hingga ter-mined
  const receipt = await tx.wait();
  console.log(`✅ Minted in block ${receipt.blockNumber}`);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
