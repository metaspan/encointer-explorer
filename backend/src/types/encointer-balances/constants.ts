import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v7 from '../v7'

export const defaultDemurrage =  {
    /**
     *  the default demurrage rate applied to community balances
     */
    v7: new ConstantType(
        'EncointerBalances.DefaultDemurrage',
        v7.FixedI128
    ),
}

export const existentialDeposit =  {
    /**
     *  Existential deposit needed to have an account in the respective community currency
     * 
     *  This does currently not prevent dust-accounts, but it prevents account creation
     *  by transferring tiny amounts of funds.
     */
    v7: new ConstantType(
        'EncointerBalances.ExistentialDeposit',
        v7.FixedI128
    ),
}
