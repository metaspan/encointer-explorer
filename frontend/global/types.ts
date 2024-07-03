interface IAccount {
  id: string
  extrinsics: IExtrinsic[]
}

interface IBlock {
  chainId: string
  id: string
  hash: string
  specVersion: string
  timestamp: string
  extrinsics: IExtrinsic[]
  events: IEvent[]
}

interface IEvent {
  chainId: string
  id: string
  block_id: bigint
  index: number
  event_id: string
  section: string
  method: string
  timestamp: string
  extrinsic: IExtrinsic
  data: string
}

interface IExtrinsic {
  // "Chain id"
  chainId: string
  // "Extrinsic id (blockNumber-index)"
  id: String
  // "Extrinsic block"
  block_id: bigint
  // "Extrinsic index in block"
  index: number
  // "Extrinsic hash"
  extrinsicHash: string
  // "Extrinsic timestamp"
  timestamp: string
  // "Extrinsic signer"
  signer?: IAccount
  // # "Extrinsic section"
  section?: string
  // "Extrinsic method"
  method?: string
  // # # "Extrinsic signer"
  // # signer: Account @index # @derivedFrom(field: "extrinsics")
  // # "Extrinsic events"
  events?: IEvent[]
  // # # "Extrinsic transfers"
  // # transfers: [Transfer!] @derivedFrom(field: "extrinsic")
  // "Extrinsic fee"
  fee?: bigint
  // "Extrinsic success"
  success?: boolean
}

export {
  IAccount,
  IBlock,
  IEvent,
  IExtrinsic
}
