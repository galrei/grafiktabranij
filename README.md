# 💎 Grafik Tabranij (GT) - Official TON Jetton Utility Token

Official repository for **Grafik Tabranij (GT)**, a TEP-74 standard utility token on the TON Blockchain designed for ecosystem access, rewards, governance, and services.

---

## 📌 Token Specifications

| Parameter | Value |
| :--- | :--- |
| **Token Name** | Grafik Tabranij |
| **Symbol / Ticker** | `GT` |
| **Total Supply** | `1,000,000,000` (1 Billion GT) |
| **Decimals** | `9` |
| **Network** | TON Mainnet |
| **Standard** | Jetton (TEP-74 / TEP-64 Off-chain Metadata) |
| **Admin Control** | Mintable (Admin Only) — Revokable |
| **Jetton Master** | [`EQDmItwXvs6n7HGzFuJe-oXCRrLUvROTEnJUdO9tYB15NQHg`](https://tonviewer.com/EQDmItwXvs6n7HGzFuJe-oXCRrLUvROTEnJUdO9tYB15NQHg) |
| **Holder #1 (Admin)** | [`EQAleoed649QywoLVz3JUxaeyyGXm10MYOOQ2XKBMCEHTUHT`](https://tonviewer.com/EQAleoed649QywoLVz3JUxaeyyGXm10MYOOQ2XKBMCEHTUHT) |

---

## 📁 Repository Structure

```
.
├── logo/
│   ├── logo.png             # Official 256x256 Token Logo PNG
│   └── README.md            # Logo replacement guide
├── metadata/
│   └── metadata.json        # Off-chain TEP-64 compliant JSON metadata
├── contracts/
│   ├── jetton_master.tact   # TEP-74 Jetton Master Smart Contract (Tact)
│   └── jetton_wallet.tact   # TEP-74 Jetton Wallet Smart Contract (Tact)
├── scripts/
│   ├── deployJettonMaster.ts # Blueprint deployment script
│   └── mintGT.ts             # Blueprint minting script
├── deploy.html               # Web-based TonConnect Deployer & Minter
└── README.md                # Technical and deployment documentation
```

---

## 🌐 1. Public Metadata & Logo URLs (GitHub Pages)

To activate GitHub Pages so wallets and DEXes can fetch your token logo and metadata:

1. Open your repository on GitHub: `https://github.com/galrei/grafiktabranij`
2. Go to **Settings** -> **Pages**.
3. Under **Build and deployment** -> **Branch**, select `main` and `/ (root)`.
4. Click **Save**.

### Active Public Endpoints:
- 🖼️ **Logo PNG (256x256):**  
  `https://galrei.github.io/grafiktabranij/logo/logo.png`
- 📜 **Metadata JSON (TEP-64):**  
  `https://galrei.github.io/grafiktabranij/metadata/metadata.json`

---

## 🚀 2. Deployment Status

> [!IMPORTANT]
> **Kontrak sudah berhasil di-deploy ke TON Mainnet.** Supply 1.000.000.000 GT sudah dicetak dan berada di wallet admin.

### ✅ Deploy & Mint via Blueprint CLI (Sudah Selesai)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Build smart contracts:
   ```bash
   npx blueprint build
   ```
3. Deploy kontrak (sudah selesai):
   ```bash
   npx blueprint run deployJettonMaster --mainnet
   ```
4. Mint 1 Miliar GT ke admin wallet (sudah selesai):
   ```bash
   npx blueprint run mintGT --mainnet
   ```

### 🌐 Web Deployer (Alternatif)
Untuk deploy/mint via browser tanpa CLI, gunakan:
👉 **[https://galrei.github.io/grafiktabranij/deploy.html](https://galrei.github.io/grafiktabranij/deploy.html)**

---

## 🔐 3. Revoking Admin Ownership (Trustless Tokenomics)

To build trust in your community, revoke admin ownership after minting total supply:

1. **Via Minter UI:** Navigate to your Jetton admin page on `minter.ton.org` and click **"Revoke Ownership"**.
2. **Via Contract Message:** Send `RevokeAdmin` message (opcode `0x4DC53751`) from the admin wallet.
3. Once revoked, no further tokens can ever be minted, guaranteeing a fixed supply of **1,000,000,000 GT**.

---

## 🌊 4. Listing & Liquidity Pools (DEX)

### 📈 STON.fi (v1 / v2)
1. Go to [STON.fi Pools](https://app.ston.fi/pools).
2. Connect owner wallet containing **GT** tokens and **TON**.
3. Click **"Add Liquidity"** / **"Create Pool"**.
4. Select `TON` and paste your **GT Jetton Master Address**.
5. Deposit your initial GT liquidity and TON (e.g. 500,000,000 GT + 100 TON) to establish the initial price.

### 🔄 DeDust.io
1. Go to [DeDust Pools](https://dedust.io/pools).
2. Connect your TON Wallet.
3. Click **"Create Pool"**, choose **Volatile Pool** (`TON` / `GT`).
4. Deposit initial GT liquidity and TON.

---

## 📝 5. Deployed Contract Addresses

| Description | Mainnet Address | Status |
| :--- | :--- | :--- |
| **Jetton Master** | [`EQDmItwXvs6n7HGzFuJe-oXCRrLUvROTEnJUdO9tYB15NQHg`](https://tonviewer.com/EQDmItwXvs6n7HGzFuJe-oXCRrLUvROTEnJUdO9tYB15NQHg) | ✅ Deployed & Minted |
| **Admin / Holder #1** | [`EQAleoed649QywoLVz3JUxaeyyGXm10MYOOQ2XKBMCEHTUHT`](https://tonviewer.com/EQAleoed649QywoLVz3JUxaeyyGXm10MYOOQ2XKBMCEHTUHT) | ✅ Active — Holds 1B GT |
| **STON.fi LP Pool** | `[PLACEHOLDER_STONFI_POOL]` | Pending LP Creation |
| **DeDust LP Pool** | `[PLACEHOLDER_DEDUST_POOL]` | Pending LP Creation |

---

## ⚠️ Security & Best Practices Warning

> [!WARNING]
> - **Immutability of Metadata:** Ensure `metadata.json` and `logo.png` URLs are active on GitHub Pages **before** deploying the contract.
> - **Liquidity Lock:** Lock or burn your LP tokens on STON.fi / DeDust after adding liquidity to prevent rug-pull accusations.
> - **Admin Revocation:** Revoke ownership to guarantee 100% fixed supply.

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).
