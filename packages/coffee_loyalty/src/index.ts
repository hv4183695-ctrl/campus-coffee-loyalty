import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
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
} as const

export type DataKey = {tag: "Admin", values: void} | {tag: "Balance", values: readonly [string]} | {tag: "TotalEarned", values: readonly [string]} | {tag: "PurchaseCount", values: readonly [string]};

export const CoffeeError = {
  1: {message:"AlreadyInitialized"},
  2: {message:"NotInitialized"},
  3: {message:"Unauthorized"},
  4: {message:"SpendTooSmall"},
  5: {message:"InvalidPoints"},
  6: {message:"InsufficientPoints"}
}

export interface Client {
  /**
   * Construct and simulate a earn transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  earn: ({admin, student, amount_vnd}: {admin: string, student: string, amount_vnd: u32}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a init transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  init: ({admin}: {admin: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a level transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  level: ({student}: {student: string}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a redeem transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  redeem: ({student, points}: {student: string, points: u32}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  balance: ({student}: {student: string}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a total_earned transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  total_earned: ({student}: {student: string}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a purchase_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  purchase_count: ({student}: {student: string}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a points_for_amount transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  points_for_amount: ({amount_vnd}: {amount_vnd: u32}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABAAAAAAAAAAAAAAABUFkbWluAAAAAAAAAQAAAAAAAAAHQmFsYW5jZQAAAAABAAAAEwAAAAEAAAAAAAAAC1RvdGFsRWFybmVkAAAAAAEAAAATAAAAAQAAAAAAAAANUHVyY2hhc2VDb3VudAAAAAAAAAEAAAAT",
        "AAAAAAAAAAAAAAAEZWFybgAAAAMAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAHc3R1ZGVudAAAAAATAAAAAAAAAAphbW91bnRfdm5kAAAAAAAEAAAAAQAAAAQ=",
        "AAAAAAAAAAAAAAAEaW5pdAAAAAEAAAAAAAAABWFkbWluAAAAAAAAEwAAAAA=",
        "AAAABAAAAAAAAAAAAAAAC0NvZmZlZUVycm9yAAAAAAYAAAAAAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAAQAAAAAAAAAOTm90SW5pdGlhbGl6ZWQAAAAAAAIAAAAAAAAADFVuYXV0aG9yaXplZAAAAAMAAAAAAAAADVNwZW5kVG9vU21hbGwAAAAAAAAEAAAAAAAAAA1JbnZhbGlkUG9pbnRzAAAAAAAABQAAAAAAAAASSW5zdWZmaWNpZW50UG9pbnRzAAAAAAAG",
        "AAAAAAAAAAAAAAAFbGV2ZWwAAAAAAAABAAAAAAAAAAdzdHVkZW50AAAAABMAAAABAAAABA==",
        "AAAAAAAAAAAAAAAGcmVkZWVtAAAAAAACAAAAAAAAAAdzdHVkZW50AAAAABMAAAAAAAAABnBvaW50cwAAAAAABAAAAAEAAAAE",
        "AAAAAAAAAAAAAAAHYmFsYW5jZQAAAAABAAAAAAAAAAdzdHVkZW50AAAAABMAAAABAAAABA==",
        "AAAAAAAAAAAAAAAMdG90YWxfZWFybmVkAAAAAQAAAAAAAAAHc3R1ZGVudAAAAAATAAAAAQAAAAQ=",
        "AAAAAAAAAAAAAAAOcHVyY2hhc2VfY291bnQAAAAAAAEAAAAAAAAAB3N0dWRlbnQAAAAAEwAAAAEAAAAE",
        "AAAAAAAAAAAAAAARcG9pbnRzX2Zvcl9hbW91bnQAAAAAAAABAAAAAAAAAAphbW91bnRfdm5kAAAAAAAEAAAAAQAAAAQ=" ]),
      options
    )
  }
  public readonly fromJSON = {
    earn: this.txFromJSON<u32>,
        init: this.txFromJSON<null>,
        level: this.txFromJSON<u32>,
        redeem: this.txFromJSON<u32>,
        balance: this.txFromJSON<u32>,
        total_earned: this.txFromJSON<u32>,
        purchase_count: this.txFromJSON<u32>,
        points_for_amount: this.txFromJSON<u32>
  }
}