import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import {Extrinsic} from "./extrinsic.model"

@Entity_()
export class Account {
    constructor(props?: Partial<Account>) {
        Object.assign(this, props)
    }

    /**
     * Chain id
     */
    @Column_("text", {nullable: false})
    chainId!: string

    /**
     * Account address
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Account extrinsics
     */
    @OneToMany_(() => Extrinsic, e => e.signer)
    extrinsics!: Extrinsic[]
}
