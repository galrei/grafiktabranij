const fs = require('fs');
const { beginCell, Address, storeStateInit } = require('@ton/core');
const { JettonMaster } = require('./build/JettonMaster/tact_JettonMaster');

async function main() {
    const adminAddress = Address.parse('EQAleoed649QywoLVz3JUxaeyyGXm10MYOOQ2XKBMCEHTUHT');
    const metadataUrl = 'https://galrei.github.io/grafiktabranij/metadata/metadata.json';
    const contentCell = beginCell().storeUint(1, 8).storeStringTail(metadataUrl).endCell();

    const jettonMaster = await JettonMaster.fromInit(adminAddress, contentCell);
    
    // Standard bounceable address format
    const contractAddress = jettonMaster.address.toString({ bounceable: true });
    const stateInitCell = beginCell().store(storeStateInit(jettonMaster.init)).endCell();
    const stateInitBase64 = stateInitCell.toBoc().toString('base64');
    
    const deployPayload = beginCell().storeUint(2490013878, 32).storeUint(0, 64).endCell().toBoc().toString('base64');
    const mintPayload = beginCell().storeUint(4235234258, 32).storeCoins(1000000000000000000n).storeAddress(adminAddress).endCell().toBoc().toString('base64');

    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deploy & Mint Grafik Tabranij (GT) Token</title>
    <script src="https://unpkg.com/@tonconnect/ui@latest/dist/tonconnect-ui.min.js"></script>
    <style>
        :root {
            --bg-color: #0f172a;
            --card-bg: #1e293b;
            --primary: #38bdf8;
            --accent: #f59e0b;
            --text: #f8fafc;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: var(--bg-color);
            color: var(--text);
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .container {
            background-color: var(--card-bg);
            border-radius: 16px;
            padding: 30px;
            max-width: 480px;
            width: 100%;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            text-align: center;
            border: 1px solid #334155;
        }
        .logo-img {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            margin-bottom: 15px;
            border: 3px solid var(--accent);
            box-shadow: 0 0 15px rgba(245, 158, 11, 0.4);
        }
        h1 {
            font-size: 24px;
            margin-bottom: 5px;
            color: #fff;
        }
        p {
            color: #94a3b8;
            font-size: 14px;
            line-height: 1.5;
        }
        .badge {
            display: inline-block;
            background: rgba(56, 189, 248, 0.15);
            color: var(--primary);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        #ton-connect-button {
            display: flex;
            justify-content: center;
            margin: 20px 0;
        }
        .btn {
            background: linear-gradient(135deg, #2563eb, #3b82f6);
            color: white;
            border: none;
            padding: 16px 24px;
            font-size: 16px;
            font-weight: bold;
            border-radius: 12px;
            cursor: pointer;
            width: 100%;
            margin-top: 12px;
            transition: all 0.2s ease;
        }
        .btn:disabled {
            background: #475569;
            cursor: not-allowed;
            opacity: 0.6;
        }
        .btn-mint {
            background: linear-gradient(135deg, #d97706, #f59e0b);
        }
        .info-box {
            background: #0f172a;
            border-radius: 10px;
            padding: 12px;
            margin-top: 20px;
            text-align: left;
            font-size: 12px;
            color: #cbd5e1;
            word-break: break-all;
        }
        #status {
            margin-top: 15px;
            font-weight: bold;
            font-size: 14px;
            padding: 10px;
            border-radius: 8px;
        }
        .success { background: rgba(74, 222, 128, 0.1); color: #4ade80; border: 1px solid #4ade80; }
        .error { background: rgba(248, 113, 113, 0.1); color: #f87171; border: 1px solid #f87171; }
        .pending { background: rgba(251, 191, 36, 0.1); color: #fbbf24; border: 1px solid #fbbf24; }
    </style>
</head>
<body>
    <div class="container">
        <img src="logo/logo.png" alt="GT Logo" class="logo-img">
        <h1>Grafik Tabranij (GT)</h1>
        <div class="badge">TON JETTON UTILITY TOKEN</div>
        <p>Portal Resmi Deploy & Mint 1 Miliar GT Token ke Dompet Anda.</p>

        <div id="ton-connect-button"></div>

        <button id="btn-deploy" class="btn" disabled>1. DEPLOY KONTRAK GT</button>
        <button id="btn-mint" class="btn btn-mint" disabled>2. MINT 1 MILIAR GT KE WALLET</button>

        <div id="status"></div>

        <div class="info-box">
            <strong>📋 Target Contract Address:</strong><br>
            <span>${contractAddress}</span><br><br>
            <strong>👤 Admin Address:</strong><br>
            <span>${adminAddress.toString()}</span>
        </div>
    </div>

    <script>
        const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
            manifestUrl: 'https://raw.githubusercontent.com/ton-org/blueprint/main/tonconnect/manifest.json',
            buttonRootId: 'ton-connect-button'
        });

        const btnDeploy = document.getElementById('btn-deploy');
        const btnMint = document.getElementById('btn-mint');
        const statusDiv = document.getElementById('status');

        const contractAddress = "${contractAddress}";
        const stateInitBase64 = "${stateInitBase64}";
        const deployPayload = "${deployPayload}";
        const mintPayload = "${mintPayload}";

        tonConnectUI.onStatusChange(wallet => {
            if (wallet) {
                btnDeploy.disabled = false;
                btnMint.disabled = false;
                statusDiv.className = "success";
                statusDiv.innerText = "✅ Wallet Terhubung: " + wallet.account.address.slice(0,6) + "..." + wallet.account.address.slice(-4);
            } else {
                btnDeploy.disabled = true;
                btnMint.disabled = true;
                statusDiv.innerText = "";
            }
        });

        btnDeploy.addEventListener('click', async () => {
            if (!tonConnectUI.connected) return;
            statusDiv.className = "pending";
            statusDiv.innerText = "⏳ Membuka transaksi Deploy di Wallet...";

            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 600,
                messages: [
                    {
                        address: contractAddress,
                        amount: "150000000",
                        stateInit: stateInitBase64,
                        payload: deployPayload
                    }
                ]
            };

            try {
                const result = await tonConnectUI.sendTransaction(transaction);
                statusDiv.className = "success";
                statusDiv.innerText = "🎉 DEPLOY SUCCESSFUL! Sekarang klik tombol 2 untuk Mint 1 Miliar GT.";
            } catch (e) {
                statusDiv.className = "error";
                statusDiv.innerText = "❌ Transaksi Error: " + (e.message || JSON.stringify(e));
            }
        });

        btnMint.addEventListener('click', async () => {
            if (!tonConnectUI.connected) return;
            statusDiv.className = "pending";
            statusDiv.innerText = "⏳ Membuka transaksi Mint 1 Miliar GT di Wallet...";

            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 600,
                messages: [
                    {
                        address: contractAddress,
                        amount: "100000000",
                        payload: mintPayload
                    }
                ]
            };

            try {
                const result = await tonConnectUI.sendTransaction(transaction);
                statusDiv.className = "success";
                statusDiv.innerText = "💎 MINTING SUCCESSFUL! 1 Miliar GT telah masuk ke Dompet Anda!";
            } catch (e) {
                statusDiv.className = "error";
                statusDiv.innerText = "❌ Transaksi Error: " + (e.message || JSON.stringify(e));
            }
        });
    </script>
</body>
</html>`;

    fs.writeFileSync('deploy.html', htmlContent);
    console.log('✅ Updated deploy.html with bounceable address EQDmItwXvs6n7HGzFuJe-oXCRrLUvROTEnJUdO9tYB15NQHg!');
}
main().catch(console.error);
