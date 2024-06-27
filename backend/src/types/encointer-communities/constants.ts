import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'

export const maxCommunityIdentifiers =  {
    v15: new ConstantType(
        'EncointerCommunities.MaxCommunityIdentifiers',
        sts.number()
    ),
}

export const maxCommunityIdentifiersPerGeohash =  {
    v15: new ConstantType(
        'EncointerCommunities.MaxCommunityIdentifiersPerGeohash',
        sts.number()
    ),
}

export const maxLocationsPerGeohash =  {
    v15: new ConstantType(
        'EncointerCommunities.MaxLocationsPerGeohash',
        sts.number()
    ),
}

export const maxBootstrappers =  {
    v15: new ConstantType(
        'EncointerCommunities.MaxBootstrappers',
        sts.number()
    ),
}
