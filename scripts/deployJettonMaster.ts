import { Address, toNano, beginCell } from '@ton/ton';
import { JettonMaster } from '../wrappers/JettonMaster';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const adminAddress = provider.sender().address;
    if (!adminAddress) {
        throw new Error('Deployer wallet address not found');
    }

    // TEP-64 Off-chain Metadata URI hosted on GitHub Pages
    const metadataUrl = "https://galrei.github.io/grafiktabranij/metadata/metadata.json";
    
    // Build Cell format for TEP-64 off-chain metadata uri (prefix 0x01)
    const contentCell = beginCell()
        .storeUint(0x01, 8)
        .storeStringTail(metadataUrl)
        .endCell();

    const jettonMaster = provider.open(await JettonMaster.fromInit(adminAddress, contentCell));

    await jettonMaster.send(
        provider.sender(),
        {
            value: toNano('0.15'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(jettonMaster.address);

    console.log('----------------------------------------------------');
    console.log('✅ Jetton Master (GT Token) successfully deployed!');
    console.log('Contract Address:', jettonMaster.address.toString());
    console.log('Metadata URL:', metadataUrl);
    console.log('Total Supply: 1,000,000,000 GT (9 Decimals)');
    console.log('----------------------------------------------------');
}
