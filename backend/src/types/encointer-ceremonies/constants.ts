import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'

export const meetupSizeTarget =  {
    v7: new ConstantType(
        'EncointerCeremonies.MeetupSizeTarget',
        sts.bigint()
    ),
}

export const meetupMinSize =  {
    v7: new ConstantType(
        'EncointerCeremonies.MeetupMinSize',
        sts.bigint()
    ),
}

export const meetupNewbieLimitDivider =  {
    v7: new ConstantType(
        'EncointerCeremonies.MeetupNewbieLimitDivider',
        sts.bigint()
    ),
}

export const maxAttestations =  {
    v15: new ConstantType(
        'EncointerCeremonies.MaxAttestations',
        sts.number()
    ),
}
