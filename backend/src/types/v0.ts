import {sts, Result, Option, Bytes, BitSequence} from './support'

export const PalletId = sts.bytes()

export const Permill = sts.number()

export const WeightToFeeCoefficient: sts.Type<WeightToFeeCoefficient> = sts.struct(() => {
    return  {
        coeffInteger: sts.bigint(),
        coeffFrac: Perbill,
        negative: sts.boolean(),
        degree: sts.number(),
    }
})

export const Perbill = sts.number()

export interface WeightToFeeCoefficient {
    coeffInteger: bigint
    coeffFrac: Perbill
    negative: boolean
    degree: number
}

export type Perbill = number

export const RuntimeVersion: sts.Type<RuntimeVersion> = sts.struct(() => {
    return  {
        specName: sts.string(),
        implName: sts.string(),
        authoringVersion: sts.number(),
        specVersion: sts.number(),
        implVersion: sts.number(),
        apis: sts.array(() => sts.tuple(() => [sts.bytes(), sts.number()])),
        transactionVersion: sts.number(),
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
}

export const RuntimeDbWeight: sts.Type<RuntimeDbWeight> = sts.struct(() => {
    return  {
        read: sts.bigint(),
        write: sts.bigint(),
    }
})

export interface RuntimeDbWeight {
    read: bigint
    write: bigint
}

export const BlockLength: sts.Type<BlockLength> = sts.struct(() => {
    return  {
        max: Type_95,
    }
})

export const Type_95: sts.Type<Type_95> = sts.struct(() => {
    return  {
        normal: sts.number(),
        operational: sts.number(),
        mandatory: sts.number(),
    }
})

export interface Type_95 {
    normal: number
    operational: number
    mandatory: number
}

export interface BlockLength {
    max: Type_95
}

export const BlockWeights: sts.Type<BlockWeights> = sts.struct(() => {
    return  {
        baseBlock: sts.bigint(),
        maxBlock: sts.bigint(),
        perClass: Type_91,
    }
})

export const Type_91: sts.Type<Type_91> = sts.struct(() => {
    return  {
        normal: WeightsPerClass,
        operational: WeightsPerClass,
        mandatory: WeightsPerClass,
    }
})

export const WeightsPerClass: sts.Type<WeightsPerClass> = sts.struct(() => {
    return  {
        baseExtrinsic: sts.bigint(),
        maxExtrinsic: sts.option(() => sts.bigint()),
        maxTotal: sts.option(() => sts.bigint()),
        reserved: sts.option(() => sts.bigint()),
    }
})

export interface WeightsPerClass {
    baseExtrinsic: bigint
    maxExtrinsic?: (bigint | undefined)
    maxTotal?: (bigint | undefined)
    reserved?: (bigint | undefined)
}

export interface Type_91 {
    normal: WeightsPerClass
    operational: WeightsPerClass
    mandatory: WeightsPerClass
}

export interface BlockWeights {
    baseBlock: bigint
    maxBlock: bigint
    perClass: Type_91
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
