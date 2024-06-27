import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v0 from '../v0'

export const transactionByteFee =  {
    /**
     *  The fee to be paid for making a transaction; the per-byte portion.
     */
    v0: new ConstantType(
        'TransactionPayment.TransactionByteFee',
        sts.bigint()
    ),
}

export const operationalFeeMultiplier =  {
    /**
     *  A fee mulitplier for `Operational` extrinsics to compute "virtual tip" to boost their
     *  `priority`
     * 
     *  This value is multipled by the `final_fee` to obtain a "virtual tip" that is later
     *  added to a tip component in regular `priority` calculations.
     *  It means that a `Normal` transaction can front-run a similarly-sized `Operational`
     *  extrinsic (with no tip), by including a tip value greater than the virtual tip.
     * 
     *  ```rust,ignore
     *  // For `Normal`
     *  let priority = priority_calc(tip);
     * 
     *  // For `Operational`
     *  let virtual_tip = (inclusion_fee + tip) * OperationalFeeMultiplier;
     *  let priority = priority_calc(tip + virtual_tip);
     *  ```
     * 
     *  Note that since we use `final_fee` the multiplier applies also to the regular `tip`
     *  sent with the transaction. So, not only does the transaction get a priority bump based
     *  on the `inclusion_fee`, but we also amplify the impact of tips applied to `Operational`
     *  transactions.
     */
    v0: new ConstantType(
        'TransactionPayment.OperationalFeeMultiplier',
        sts.number()
    ),
}

export const weightToFee =  {
    /**
     *  The polynomial that is applied in order to derive fee from weight.
     */
    v0: new ConstantType(
        'TransactionPayment.WeightToFee',
        sts.array(() => v0.WeightToFeeCoefficient)
    ),
}