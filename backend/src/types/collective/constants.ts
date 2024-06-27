import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v15 from '../v15'

export const maxProposalWeight =  {
    /**
     *  The maximum weight of a dispatch call that can be proposed and executed.
     */
    v15: new ConstantType(
        'Collective.MaxProposalWeight',
        v15.Weight
    ),
}
