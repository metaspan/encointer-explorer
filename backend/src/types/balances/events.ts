import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v0 from '../v0'
import * as v7 from '../v7'
import * as v15 from '../v15'

export const endowed =  {
    name: 'Balances.Endowed',
    /**
     * An account was created with some free balance. \[account, free_balance\]
     */
    v0: new EventType(
        'Balances.Endowed',
        sts.tuple([v0.AccountId32, sts.bigint()])
    ),
    /**
     * An account was created with some free balance.
     */
    v7: new EventType(
        'Balances.Endowed',
        sts.struct({
            account: v7.AccountId32,
            freeBalance: sts.bigint(),
        })
    ),
}

export const dustLost =  {
    name: 'Balances.DustLost',
    /**
     * An account was removed whose balance was non-zero but below ExistentialDeposit,
     * resulting in an outright loss. \[account, balance\]
     */
    v0: new EventType(
        'Balances.DustLost',
        sts.tuple([v0.AccountId32, sts.bigint()])
    ),
    /**
     * An account was removed whose balance was non-zero but below ExistentialDeposit,
     * resulting in an outright loss.
     */
    v7: new EventType(
        'Balances.DustLost',
        sts.struct({
            account: v7.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     * Transfer succeeded. \[from, to, value\]
     */
    v0: new EventType(
        'Balances.Transfer',
        sts.tuple([v0.AccountId32, v0.AccountId32, sts.bigint()])
    ),
    /**
     * Transfer succeeded.
     */
    v7: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v7.AccountId32,
            to: v7.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const balanceSet =  {
    name: 'Balances.BalanceSet',
    /**
     * A balance was set by root. \[who, free, reserved\]
     */
    v0: new EventType(
        'Balances.BalanceSet',
        sts.tuple([v0.AccountId32, sts.bigint(), sts.bigint()])
    ),
    /**
     * A balance was set by root.
     */
    v7: new EventType(
        'Balances.BalanceSet',
        sts.struct({
            who: v7.AccountId32,
            free: sts.bigint(),
            reserved: sts.bigint(),
        })
    ),
    /**
     * A balance was set by root.
     */
    v15: new EventType(
        'Balances.BalanceSet',
        sts.struct({
            who: v15.AccountId32,
            free: sts.bigint(),
        })
    ),
}

export const reserved =  {
    name: 'Balances.Reserved',
    /**
     * Some balance was reserved (moved from free to reserved). \[who, value\]
     */
    v0: new EventType(
        'Balances.Reserved',
        sts.tuple([v0.AccountId32, sts.bigint()])
    ),
    /**
     * Some balance was reserved (moved from free to reserved).
     */
    v7: new EventType(
        'Balances.Reserved',
        sts.struct({
            who: v7.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const unreserved =  {
    name: 'Balances.Unreserved',
    /**
     * Some balance was unreserved (moved from reserved to free). \[who, value\]
     */
    v0: new EventType(
        'Balances.Unreserved',
        sts.tuple([v0.AccountId32, sts.bigint()])
    ),
    /**
     * Some balance was unreserved (moved from reserved to free).
     */
    v7: new EventType(
        'Balances.Unreserved',
        sts.struct({
            who: v7.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const reserveRepatriated =  {
    name: 'Balances.ReserveRepatriated',
    /**
     * Some balance was moved from the reserve of the first account to the second account.
     * Final argument indicates the destination balance type.
     * \[from, to, balance, destination_status\]
     */
    v0: new EventType(
        'Balances.ReserveRepatriated',
        sts.tuple([v0.AccountId32, v0.AccountId32, sts.bigint(), v0.BalanceStatus])
    ),
    /**
     * Some balance was moved from the reserve of the first account to the second account.
     * Final argument indicates the destination balance type.
     */
    v7: new EventType(
        'Balances.ReserveRepatriated',
        sts.struct({
            from: v7.AccountId32,
            to: v7.AccountId32,
            amount: sts.bigint(),
            destinationStatus: v7.BalanceStatus,
        })
    ),
}

export const deposit =  {
    name: 'Balances.Deposit',
    /**
     * Some amount was deposited into the account (e.g. for transaction fees). \[who,
     * deposit\]
     */
    v0: new EventType(
        'Balances.Deposit',
        sts.tuple([v0.AccountId32, sts.bigint()])
    ),
    /**
     * Some amount was deposited (e.g. for transaction fees).
     */
    v7: new EventType(
        'Balances.Deposit',
        sts.struct({
            who: v7.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const withdraw =  {
    name: 'Balances.Withdraw',
    /**
     * Some amount was withdrawn from the account (e.g. for transaction fees). \[who, value\]
     */
    v0: new EventType(
        'Balances.Withdraw',
        sts.tuple([v0.AccountId32, sts.bigint()])
    ),
    /**
     * Some amount was withdrawn from the account (e.g. for transaction fees).
     */
    v7: new EventType(
        'Balances.Withdraw',
        sts.struct({
            who: v7.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const slashed =  {
    name: 'Balances.Slashed',
    /**
     * Some amount was removed from the account (e.g. for misbehavior). \[who,
     * amount_slashed\]
     */
    v0: new EventType(
        'Balances.Slashed',
        sts.tuple([v0.AccountId32, sts.bigint()])
    ),
    /**
     * Some amount was removed from the account (e.g. for misbehavior).
     */
    v7: new EventType(
        'Balances.Slashed',
        sts.struct({
            who: v7.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
