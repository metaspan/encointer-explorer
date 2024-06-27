import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Event} from "./event.model"
import {Extrinsic} from "./extrinsic.model"

@Entity_()
export class Block {
    constructor(props?: Partial<Block>) {
        Object.assign(this, props)
    }

    /**
     * Chain id
     */
    @Column_("text", {nullable: false})
    chainId!: string

    /**
     * Block number
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Block hash
     */
    @Index_()
    @Column_("text", {nullable: false})
    hash!: string

    /**
     * Block timestamp
     */
    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Column_("text", {nullable: true})
    specVersion!: string | undefined | null

    @OneToMany_(() => Event, e => e.block)
    events!: Event[]

    @OneToMany_(() => Extrinsic, e => e.block)
    extrinsics!: Extrinsic[]
}
