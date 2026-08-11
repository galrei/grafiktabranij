import "@stdlib/deploy";

// ============================================================================
// TEP-74 Jetton Wallet Standard Contract (Tact 1.6+ Standard for TON)
// Token: Grafik Tabranij (GT)
// ============================================================================

message TokenTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseAddress: Address?;
    customPayload: Cell?;
    forwardTonAmount: Int as coins;
    forwardPayload: Slice as remaining;
}

message TokenTransferInternal {
    queryId: Int as uint64;
    amount: Int as coins;
    from: Address;
    responseAddress: Address?;
    forwardTonAmount: Int as coins;
    forwardPayload: Cell;
}

message TokenNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    from: Address;
    forwardPayload: Slice as remaining;
}

message TokenBurn {
    queryId: Int as uint64;
    amount: Int as coins;
    responseAddress: Address?;
    customPayload: Cell?;
}

struct JettonWalletData {
    balance: Int;
    owner: Address;
    master: Address;
    walletCode: Cell;
}

contract JettonWallet with Deployable {
    balance: Int as coins;
    owner: Address;
    master: Address;

    init(owner: Address, master: Address) {
        self.balance = 0;
        self.owner = owner;
        self.master = master;
    }

    receive(msg: TokenTransferInternal) {
        let ctx: Context = context();
        require(ctx.sender == self.master || ctx.sender == self.getWalletAddress(msg.from), "Invalid sender");
        
        self.balance = self.balance + msg.amount;

        if (msg.forwardTonAmount > 0) {
            send(SendParameters{
                to: self.owner,
                value: msg.forwardTonAmount,
                mode: SendPayGasSeparately,
                bounce: false,
                body: TokenNotification{
                    queryId: msg.queryId,
                    amount: msg.amount,
                    from: msg.from,
                    forwardPayload: msg.forwardPayload.asSlice()
                }.toCell()
            });
        }
    }

    receive(msg: TokenTransfer) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Only owner can transfer");
        require(self.balance >= msg.amount, "Insufficient balance");

        self.balance = self.balance - msg.amount;

        let targetWalletInit: StateInit = initOf JettonWallet(msg.destination, self.master);
        let targetWalletAddress: Address = contractAddress(targetWalletInit);

        send(SendParameters{
            to: targetWalletAddress,
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: TokenTransferInternal{
                queryId: msg.queryId,
                amount: msg.amount,
                from: self.owner,
                responseAddress: msg.responseAddress,
                forwardTonAmount: msg.forwardTonAmount,
                forwardPayload: msg.forwardPayload ?? emptyCell()
            }.toCell(),
            code: targetWalletInit.code,
            data: targetWalletInit.data
        });
    }

    receive(msg: TokenBurn) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Only owner can burn");
        require(self.balance >= msg.amount, "Insufficient balance");

        self.balance = self.balance - msg.amount;
        
        send(SendParameters{
            to: self.master,
            value: 0,
            mode: SendRemainingValue,
            bounce: false,
            body: msg.toCell()
        });
    }

    get fun getWalletAddress(owner: Address): Address {
        let walletInit: StateInit = initOf JettonWallet(owner, self.master);
        return contractAddress(walletInit);
    }

    get fun get_wallet_data(): JettonWalletData {
        return JettonWalletData{
            balance: self.balance,
            owner: self.owner,
            master: self.master,
            walletCode: initOf JettonWallet(self.owner, self.master).code
        };
    }
}
