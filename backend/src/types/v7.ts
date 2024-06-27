import {sts, Result, Option, Bytes, BitSequence} from './support'

export const FixedI128: sts.Type<FixedI128> = sts.struct(() => {
    return  {
        bits: sts.bigint(),
    }
})

export interface FixedI128 {
    bits: bigint
}

export const RuntimeVersion: sts.Type<RuntimeVersion> = sts.struct(() => {
    return  {
        specName: sts.string(),
        implName: sts.string(),
        authoringVersion: sts.number(),
        specVersion: sts.number(),
        implVersion: sts.number(),
        apis: sts.array(() => sts.tuple(() => [sts.bytes(), sts.number()])),
        transactionVersion: sts.number(),
        stateVersion: sts.number(),
    }
})

export interface RuntimeVersion {
    specName: string
    implName: string
    authoringVersion: number
    specVersion: number
    implVersion: number
    apis: [Bytes, number][]
    transactionVersion: number
    stateVersion: number
}

export const BalanceStatus: sts.Type<BalanceStatus> = sts.closedEnum(() => {
    return  {
        Free: sts.unit(),
        Reserved: sts.unit(),
    }
})

export type BalanceStatus = BalanceStatus_Free | BalanceStatus_Reserved

export interface BalanceStatus_Free {
    __kind: 'Free'
}

export interface BalanceStatus_Reserved {
    __kind: 'Reserved'
}

export const AccountId32 = sts.bytes()
