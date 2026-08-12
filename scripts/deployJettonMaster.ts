import { toNano, beginCell } from "@ton/core";
import { JettonMaster } from "../build/JettonMaster/tact_JettonMaster";
import { NetworkProvider } from "@ton/blueprint";

export async function run(provider: NetworkProvider) {
    const adminAddress = provider.sender().address!;

    console.log("🚀 Deploying Grafik Tabranij (GT) Jetton Token...");
    console.log("👤 Admin Address:", adminAddress.toString());

    // TEP-64 Off-chain Metadata URI
    const metadataUrl = "https://galrei.github.io/grafiktabranij/metadata/metadata.json";
    const contentCell = beginCell()
        .storeUint(0x01, 8)
        .storeStringTail(metadataUrl)
        .endCell();

    const jettonMaster = provider.open(
        await JettonMaster.fromInit(adminAddress, contentCell)
    );

    console.log("📋 Contract Address:", jettonMaster.address.toString());
    console.log("📜 Metadata URL:", metadataUrl);

    // Step 1: Deploy Contract
    await jettonMaster.send(
        provider.sender(),
        { value: toNano("0.15") },
        {
            $$type: "Deploy",
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(jettonMaster.address);

    // Step 2: Mint 1,000,000,000 GT to admin wallet
    console.log("🪙 Minting 1,000,000,000 GT to admin wallet...");
    await jettonMaster.send(
        provider.sender(),
        { value: toNano("0.1") },
        {
            $$type: "Mint",
            amount: 1000000000000000000n, // 1 Billion GT (9 decimals)
            receiver: adminAddress,
        }
    );

    console.log("----------------------------------------------------");
    console.log("✅ Grafik Tabranij (GT) Token successfully deployed & minted!");
    console.log("📋 Contract Address:", jettonMaster.address.toString());
    console.log("💎 Total Supply: 1,000,000,000 GT (Minted to Admin)");
    console.log("🔗 View on Tonviewer: https://tonviewer.com/" + jettonMaster.address.toString());
    console.log("----------------------------------------------------");
}
