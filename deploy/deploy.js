const hre = require("hardhat");

async function main() {
  // 1. Ambil signer (deployer)
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with address:", deployer.address);

  // 2. Ambil factory kontrak
  const FinEuroToken = await hre.ethers.getContractFactory("FinEuroToken");

  // 3. Deploy, passing initialOwner = deployer.address
  const token = await FinEuroToken.deploy(deployer.address);

  // 4. Tunggu hingga proses mining selesai
  await token.deployed();

  console.log("✅ FinEuroToken deployed at:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
