import "@stdlib/deploy";
import "./jetton_wallet.tact";

// ============================================================================
// TEP-74 Jetton Master Standard Contract (Tact 1.6+ Standard for TON)
// Token: Grafik Tabranij (GT)
// Supply: 1,000,000,000 GT (1 Billion) | Decimals: 9
// ============================================================================

struct JettonData {
    totalSupply: Int;
    mintable: Bool;
    adminAddress: Address;
    content: Cell;
    walletCode: Cell;
}

message Mint {
    amount: Int;
    receiver: Address;
}

message RevokeAdmin {
}

contract JettonMaster with Deployable {
    totalSupply: Int;
    mintable: Bool;
    adminAddress: Address;
    content: Cell;
    walletCode: Cell;

    init(adminAddress: Address, content: Cell) {
        self.totalSupply = 1000000000000000000; // 1 Billion GT (with 9 decimals: 1,000,000,000 * 10^9)
        self.mintable = false; // Fixed supply token
        self.adminAddress = adminAddress;
        self.content = content;
        self.walletCode = initCode JettonWallet(self.adminAddress, myAddress());
    }

    receive(msg: Mint) {
        let ctx: Context = context();
        require(ctx.sender == self.adminAddress, "Only admin can mint");
        require(self.mintable, "Token is no longer mintable");

        self.totalSupply = self.totalSupply + msg.amount;
        self.deployWallet(msg.receiver, msg.amount);
    }

    receive(msg: RevokeAdmin) {
        let ctx: Context = context();
        require(ctx.sender == self.adminAddress, "Only admin can revoke");
        self.adminAddress = newAddress(0, 0); // Revoke ownership to zero address (trustless)
        self.mintable = false;
    }

    fun deployWallet(to: Address, amount: Int) {
        let walletInit: StateInit = initOf JettonWallet(to, myAddress());
        let walletAddress: Address = contractAddress(walletInit);

        send(SendParameters{
            to: walletAddress,
            value: ton("0.05"),
            bounce: false,
            mode: SendIgnoreErrors,
            body: TokenTransferInternal{
                queryId: 0,
                amount: amount,
                from: myAddress(),
                responseAddress: to,
                forwardTonAmount: 0,
                forwardPayload: emptyCell()
            }.toCell(),
            code: walletInit.code,
            data: walletInit.data
        });
    }

    get fun get_jetton_data(): JettonData {
        return JettonData{
            totalSupply: self.totalSupply,
            mintable: self.mintable,
            adminAddress: self.adminAddress,
            content: self.content,
            walletCode: self.walletCode
        };
    }

    get fun get_wallet_address(owner: Address): Address {
        let walletInit: StateInit = initOf JettonWallet(owner, myAddress());
        return contractAddress(walletInit);
    }
}
