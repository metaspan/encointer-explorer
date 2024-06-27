import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'

export const momentsPerDay =  {
    v7: new ConstantType(
        'EncointerScheduler.MomentsPerDay',
        sts.bigint()
    ),
}
