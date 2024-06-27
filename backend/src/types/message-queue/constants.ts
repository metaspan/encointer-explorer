import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v1002000 from '../v1002000'

export const heapSize =  {
    /**
     *  The size of the page; this implies the maximum message size which can be sent.
     * 
     *  A good value depends on the expected message sizes, their weights, the weight that is
     *  available for processing them and the maximal needed message size. The maximal message
     *  size is slightly lower than this as defined by [`MaxMessageLenOf`].
     */
    v1002000: new ConstantType(
        'MessageQueue.HeapSize',
        sts.number()
    ),
}

export const maxStale =  {
    /**
     *  The maximum number of stale pages (i.e. of overweight messages) allowed before culling
     *  can happen. Once there are more stale pages than this, then historical pages may be
     *  dropped, even if they contain unprocessed overweight messages.
     */
    v1002000: new ConstantType(
        'MessageQueue.MaxStale',
        sts.number()
    ),
}

export const serviceWeight =  {
    /**
     *  The amount of weight (if any) which should be provided to the message queue for
     *  servicing enqueued items.
     * 
     *  This may be legitimately `None` in the case that you will call
     *  `ServiceQueues::service_queues` manually.
     */
    v1002000: new ConstantType(
        'MessageQueue.ServiceWeight',
        sts.option(() => v1002000.Weight)
    ),
}
