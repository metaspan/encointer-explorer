import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v0 from '../v0'

export const proposalBond =  {
    /**
     *  Fraction of a proposal's value that should be bonded in order to place the proposal.
     *  An accepted proposal gets these back. A rejected proposal does not.
     */
    v0: new ConstantType(
        'Treasury.ProposalBond',
        v0.Permill
    ),
}

export const proposalBondMinimum =  {
    /**
     *  Minimum amount of funds that should be placed in a deposit for making a proposal.
     */
    v0: new ConstantType(
        'Treasury.ProposalBondMinimum',
        sts.bigint()
    ),
}

export const spendPeriod =  {
    /**
     *  Period between successive spends.
     */
    v0: new ConstantType(
        'Treasury.SpendPeriod',
        sts.number()
    ),
}

export const burn =  {
    /**
     *  Percentage of spare funds (if any) that are burnt per spend period.
     */
    v0: new ConstantType(
        'Treasury.Burn',
        v0.Permill
    ),
}

export const palletId =  {
    /**
     *  The treasury's pallet id, used for deriving its sovereign account ID.
     */
    v0: new ConstantType(
        'Treasury.PalletId',
        v0.PalletId
    ),
}

export const maxApprovals =  {
    /**
     *  The maximum number of approvals that can wait in the spending queue.
     */
    v0: new ConstantType(
        'Treasury.MaxApprovals',
        sts.number()
    ),
}

export const proposalBondMaximum =  {
    /**
     *  Maximum amount of funds that should be placed in a deposit for making a proposal.
     */
    v7: new ConstantType(
        'Treasury.ProposalBondMaximum',
        sts.option(() => sts.bigint())
    ),
}

export const payoutPeriod =  {
    /**
     *  The period during which an approved treasury spend has to be claimed.
     */
    v1002000: new ConstantType(
        'Treasury.PayoutPeriod',
        sts.number()
    ),
}
