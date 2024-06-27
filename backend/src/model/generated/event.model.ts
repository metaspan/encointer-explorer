import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Block} from "./block.model"
import {Extrinsic} from "./extrinsic.model"

@Entity_()
export class Event {
    constructor(props?: Partial<Event>) {
        Object.assign(this, props)
    }

    /**
     * Chain id
     */
    @Column_("text", {nullable: false})
    chainId!: string

    /**
     * Event id (blockNumber-index)
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Event block
     */
    @Index_()
    @ManyToOne_(() => Block, {nullable: true})
    block!: Block

    /**
     * Event index in block
     */
    @Index_()
    @Column_("int4", {nullable: false})
    index!: number

    /**
     * Event extrinsicId
     */
    @Index_()
    @ManyToOne_(() => Extrinsic, {nullable: true})
    extrinsic!: Extrinsic

    /**
     * Event section
     */
    @Index_()
    @Column_("text", {nullable: false})
    section!: string

    /**
     * Event method
     */
    @Index_()
    @Column_("text", {nullable: false})
    method!: string

    /**
     * Event data
     */
    @Index_()
    @Column_("text", {nullable: false})
    data!: string

    /**
     * Event timestamp
     */
    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date
}
