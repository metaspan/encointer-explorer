import {sts, Result, Option, Bytes, BitSequence} from './support'

export const PalletId = sts.bytes()

export const Weight: sts.Type<Weight> = sts.struct(() => {
    return  {
        refTime: sts.bigint(),
        proofSize: sts.bigint(),
    }
})

export interface Weight {
    refTime: bigint
    proofSize: bigint
}

export const BlockWeights: sts.Type<BlockWeights> = sts.struct(() => {
    return  {
        baseBlock: Weight,
        maxBlock: Weight,
        perClass: Type_149,
    }
})

export const Type_149: sts.Type<Type_149> = sts.struct(() => {
    return  {
        normal: WeightsPerClass,
        operational: WeightsPerClass,
        mandatory: WeightsPerClass,
    }
})

export const WeightsPerClass: sts.Type<WeightsPerClass> = sts.struct(() => {
    return  {
        baseExtrinsic: Weight,
        maxExtrinsic: sts.option(() => Weight),
        maxTotal: sts.option(() => Weight),
        reserved: sts.option(() => Weight),
    }
})

export interface WeightsPerClass {
    baseExtrinsic: Weight
    maxExtrinsic?: (Weight | undefined)
    maxTotal?: (Weight | undefined)
    reserved?: (Weight | undefined)
}

export interface Type_149 {
    normal: WeightsPerClass
    operational: WeightsPerClass
    mandatory: WeightsPerClass
}

export interface BlockWeights {
    baseBlock: Weight
    maxBlock: Weight
    perClass: Type_149
}

export const AccountId32 = sts.bytes()
