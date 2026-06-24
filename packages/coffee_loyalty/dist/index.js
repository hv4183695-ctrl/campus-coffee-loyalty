import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
if (typeof window !== "undefined") {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CBOOI6YDXYCVZZPAMIRAV3DHLGZH6F4G5M6OKG5UYPUGCJLKJED5KXIE",
    }
};
export const CoffeeError = {
    1: { message: "AlreadyInitialized" },
    2: { message: "NotInitialized" },
    3: { message: "Unauthorized" },
    4: { message: "SpendTooSmall" },
    5: { message: "InvalidPoints" },
    6: { message: "InsufficientPoints" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABAAAAAAAAAAAAAAABUFkbWluAAAAAAAAAQAAAAAAAAAHQmFsYW5jZQAAAAABAAAAEwAAAAEAAAAAAAAAC1RvdGFsRWFybmVkAAAAAAEAAAATAAAAAQAAAAAAAAANUHVyY2hhc2VDb3VudAAAAAAAAAEAAAAT",
            "AAAAAAAAAAAAAAAEZWFybgAAAAMAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAHc3R1ZGVudAAAAAATAAAAAAAAAAphbW91bnRfdm5kAAAAAAAEAAAAAQAAAAQ=",
            "AAAAAAAAAAAAAAAEaW5pdAAAAAEAAAAAAAAABWFkbWluAAAAAAAAEwAAAAA=",
            "AAAABAAAAAAAAAAAAAAAC0NvZmZlZUVycm9yAAAAAAYAAAAAAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAAQAAAAAAAAAOTm90SW5pdGlhbGl6ZWQAAAAAAAIAAAAAAAAADFVuYXV0aG9yaXplZAAAAAMAAAAAAAAADVNwZW5kVG9vU21hbGwAAAAAAAAEAAAAAAAAAA1JbnZhbGlkUG9pbnRzAAAAAAAABQAAAAAAAAASSW5zdWZmaWNpZW50UG9pbnRzAAAAAAAG",
            "AAAAAAAAAAAAAAAFbGV2ZWwAAAAAAAABAAAAAAAAAAdzdHVkZW50AAAAABMAAAABAAAABA==",
            "AAAAAAAAAAAAAAAGcmVkZWVtAAAAAAACAAAAAAAAAAdzdHVkZW50AAAAABMAAAAAAAAABnBvaW50cwAAAAAABAAAAAEAAAAE",
            "AAAAAAAAAAAAAAAHYmFsYW5jZQAAAAABAAAAAAAAAAdzdHVkZW50AAAAABMAAAABAAAABA==",
            "AAAAAAAAAAAAAAAMdG90YWxfZWFybmVkAAAAAQAAAAAAAAAHc3R1ZGVudAAAAAATAAAAAQAAAAQ=",
            "AAAAAAAAAAAAAAAOcHVyY2hhc2VfY291bnQAAAAAAAEAAAAAAAAAB3N0dWRlbnQAAAAAEwAAAAEAAAAE",
            "AAAAAAAAAAAAAAARcG9pbnRzX2Zvcl9hbW91bnQAAAAAAAABAAAAAAAAAAphbW91bnRfdm5kAAAAAAAEAAAAAQAAAAQ="]), options);
        this.options = options;
    }
    fromJSON = {
        earn: (this.txFromJSON),
        init: (this.txFromJSON),
        level: (this.txFromJSON),
        redeem: (this.txFromJSON),
        balance: (this.txFromJSON),
        total_earned: (this.txFromJSON),
        purchase_count: (this.txFromJSON),
        points_for_amount: (this.txFromJSON)
    };
}
