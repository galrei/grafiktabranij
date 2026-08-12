import { Address, Cell } from "@ton/core";
import { ContractProvider, Sender, SendMode, beginCell, contractAddress } from "@ton/core";
import { Contract, TupleItemCell } from "@ton/core";
import { storeStateInit } from "@ton/core";

export class JettonMaster implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell }
    ) {}

    static async fromInit(adminAddress: Address, content: Cell): Promise<JettonMaster> {
        const __code = Cell.fromBase64(
            require("../build/JettonMaster.compiled.json").hex
                ? Buffer.from(require("../build/JettonMaster.compiled.json").hex, "hex").toString("base64")
                : require("../build/JettonMaster.compiled.json").base64
        );
        const __data = beginCell()
            .storeCoins(1000000000000000000n)
            .storeBit(false)
            .storeAddress(adminAddress)
            .storeRef(content)
            .storeRef(beginCell().endCell())
            .endCell();

        const _init = { code: __code, data: __data };
        const address = contractAddress(0, _init);
        return new JettonMaster(address, _init);
    }

    async send(
        provider: ContractProvider,
        via: Sender,
        args: { value: bigint; bounce?: boolean | null | undefined },
        message: { $$type: "Deploy"; queryId: bigint }
    ) {
        let body: Cell;
        if (message.$$type === "Deploy") {
            body = beginCell()
                .storeUint(2490013878, 32)
                .storeUint(message.queryId, 64)
                .endCell();
        } else {
            throw new Error("Unknown message type");
        }

        await provider.internal(via, {
            ...args,
            to: this.address,
            body: body,
        });
    }
}
