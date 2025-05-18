# Fin-Euro Token System

Repositori ini mengimplementasikan alur lengkap untuk men-tokenisasi file `.fin` ke blockchain Ethereum:

- **Smart Contract**: Solidity (`FinEuroToken.sol`)
- **Deploy**: Hardhat (`deploy/deploy.js`)
- **Oracle-JS**: Skrip Node.js untuk interaksi on-chain (`oracle-js/`)
- **Validator-PY**: Skrip Python untuk parsing `.fin` & EIP-712 signature (`validator-py/`)

---

## 📁 Struktur Proyek

```
fin-token-system/
├─ contracts/                   # Smart contract Solidity
│  └─ FinEuroToken.sol
├─ deploy/                      # Skrip deploy Hardhat
│  └─ deploy.js
├─ oracle-js/                   # Node.js: mintFromFIN, mintWithSig, listener
│  ├─ getNetwork.js
│  ├─ contract-abi.json
│  ├─ mintFromFIN.js
│  ├─ mintWithSig.js
│  ├─ burnListener.js
│  └─ payoutSender.js
├─ validator-py/                # Python: parse_fin, sign_payload
│  ├─ parse_fin.py
│  ├─ sign_payload.py
│  └─ utils.py
├─ scripts/                     # Utility (export-abi.js)
├─ .env                         # Konfigurasi global
├─ hardhat.config.js            # Hardhat & Etherscan config
├─ package.json                 # Root JS deps & skrip
└─ venv/                        # Virtualenv Python
```

---

## ⚙️ Prasyarat

- **Node.js v16+** & npm / yarn
- **Python 3.8+** dan `venv`
- **Git**

---

## 📦 Pengaturan Global

1.  **Clone repositori**

    ```
    git clone <repo-url> fin-token-system
    cd fin-token-system
    ```

2.  **Instal dependensi Node**

    ```
    npm install --save-dev hardhat @nomiclabs/hardhat-ethers @nomiclabs/hardhat-etherscan ethers dotenv @openzeppelin/contracts
    ```

3.  **Buat file** `**.env**` di root dan tambahkan:

    ```
    PRIVATE_KEY=0x...
    RPC_SEPOLIA=https://rpc.sepolia.org
    RPC_MAINNET=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
    CHAIN_ID_SEPOLIA=11155111
    CHAIN_ID_MAINNET=1
    CONTRACT_ADDRESS_SEPOLIA=
    CONTRACT_ADDRESS_MAINNET=
    ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
    ```

4.  **Setup Python virtualenv**

    ```
    python -m venv venv
    source venv/bin/activate   # Windows: venv\Scripts\activate
    pip install requests web3 eth-account python-dotenv
    ```

---

## 🔨 Konfigurasi Hardhat

Edit `hardhat.config.js`:

```
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

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
  etherscan: { apiKey: process.env.ETHERSCAN_API_KEY },
};
```

---

## 🛠 Compile & Export ABI

1.  **Compile kontrak**

    ```
    npx hardhat compile
    ```

2.  **Ekspor ABI** ke `oracle-js/contract-abi.json`:

    ```
    node scripts/export-abi.js
    ```

---

## 🚀 Deploy & Verifikasi

### Deploy ke Sepolia

```
npx hardhat run deploy/deploy.js --network sepolia
```

- Salin address kontrak dan update `.env`:

  ```
  CONTRACT_ADDRESS_SEPOLIA=0xYourDeployedAddress
  ```

### Verifikasi di Etherscan Sepolia

```
npx hardhat verify --network sepolia \
  0xYourDeployedAddress 0xYourDeployerAddress
```

> **Catatan**: Gunakan flag `--network mainnet` untuk deploy/verify di Mainnet.

---

## 🔑 Oracle-JS (Node.js)

Di folder `oracle-js/`:

```
npm install ethers dotenv
```

- **getNetwork.js**: pilih Sepolia/Mainnet berdasarkan argumen
- **mintFromFIN.js**: mint by owner
- **mintWithSig.js**: mint via EIP-712 signature
- **burnListener.js**: pantau event `BurnedFIN`
- **payoutSender.js**: trigger payout off-chain

**Contoh**:

```
node mintFromFIN.js --mainnet
node mintWithSig.js
```

---

## 🔄 Alur Kerja

1.  **Parse**: ambil `cid`, `txCode`, `receiver`, `amount`, `nonce`
2.  **Sign**: hasilkan `signature`
3.  **Mint**: Node.js `mintWithSig.js` → submit mint transaction on-chain
4.  **Verifikasi**: Cek event `MintedFIN` di Etherscan & balance penerima
