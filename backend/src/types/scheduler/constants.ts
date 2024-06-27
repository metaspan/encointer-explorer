import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v15 from '../v15'

export const maximumWeight =  {
    /**
     *  The maximum weight that may be scheduled per block for any dispatchables of less
     *  priority than `schedule::HARD_DEADLINE`.
     */
    v7: new ConstantType(
        'Scheduler.MaximumWeight',
        sts.bigint()
    ),
    /**
     *  The maximum weight that may be scheduled per block for any dispatchables.
     */
    v15: new ConstantType(
        'Scheduler.MaximumWeight',
        v15.Weight
    ),
}

export const maxScheduledPerBlock =  {
    /**
     *  The maximum number of scheduled calls in the queue for a single block.
     *  Not strictly enforced, but used for weight estimation.
     */
    v7: new ConstantType(
        'Scheduler.MaxScheduledPerBlock',
        sts.number()
    ),
}
