import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v12 from '../v12'

export const transactionFeePaid =  {
    name: 'TransactionPayment.TransactionFeePaid',
    /**
     * A transaction fee `actual_fee`, of which `tip` was added to the minimum inclusion fee,
     * has been paid by `who`.
     */
    v12: new EventType(
        'TransactionPayment.TransactionFeePaid',
        sts.struct({
            who: v12.AccountId32,
            actualFee: sts.bigint(),
            tip: sts.bigint(),
        })
    ),
}
