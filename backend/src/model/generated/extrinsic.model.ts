import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Block} from "./block.model"
import {Account} from "./account.model"
import {Event} from "./event.model"

@Entity_()
export class Extrinsic {
    constructor(props?: Partial<Extrinsic>) {
        Object.assign(this, props)
    }

    /**
     * Chain id
     */
    @Column_("text", {nullable: false})
    chainId!: string

    /**
     * Extrinsic id (blockNumber-index)
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Extrinsic block
     */
    @Index_()
    @ManyToOne_(() => Block, {nullable: true})
    block!: Block

    /**
     * Extrinsic index in block
     */
    @Index_()
    @Column_("int4", {nullable: false})
    index!: number

    /**
     * Extrinsic hash
     */
    @Index_()
    @Column_("text", {nullable: false})
    extrinsicHash!: string

    /**
     * Extrinsic timestamp
     */
    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    /**
     * Extrinsic signer
     */
    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    signer!: Account | undefined | null

    @Index_()
    @Column_("text", {nullable: false})
    section!: string

    /**
     * Extrinsic method
     */
    @Index_()
    @Column_("text", {nullable: false})
    method!: string

    @OneToMany_(() => Event, e => e.extrinsic)
    events!: Event[]

    /**
     * Extrinsic fee
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    fee!: bigint

    /**
     * Extrinsic success
     */
    @Index_()
    @Column_("bool", {nullable: true})
    success!: boolean | undefined | null
}
