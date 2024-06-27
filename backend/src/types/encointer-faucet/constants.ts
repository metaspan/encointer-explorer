import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v15 from '../v15'

export const palletId =  {
    v15: new ConstantType(
        'EncointerFaucet.PalletId',
        v15.PalletId
    ),
}
