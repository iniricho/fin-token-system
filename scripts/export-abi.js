// scripts/export-abi.js
const fs = require("fs");
const path = require("path");

// Path ke artefak setelah compile
const artifactPath = path.join(
  __dirname,
  "..",
  "artifacts",
  "contracts",
  "FinEuroToken.sol",
  "FinEuroToken.json"
);

// Baca JSON artefak
const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

// Ambil hanya ABI
const abi = artifact.abi;

// Tulis ke file contract-abi.json di folder oracle-js
const outPath = path.join(__dirname, "..", "oracle-js", "contract-abi.json");
fs.writeFileSync(outPath, JSON.stringify(abi, null, 2));

console.log("✅ ABI exported to", outPath);
