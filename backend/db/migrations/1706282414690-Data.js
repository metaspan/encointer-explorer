module.exports = class Data1706282414690 {
    name = 'Data1706282414690'

    async up(db) {
        await db.query(`CREATE TABLE "account" (
          "chain_id" character varying NOT NULL,
          "id" character varying NOT NULL,
          CONSTRAINT "PK_5a7a02c20412299d2f3f0f6b8f5" PRIMARY KEY ("id"))`)

        await db.query(`CREATE TABLE "block" (
          "chain_id" character varying NOT NULL, 
          "id" bigint NOT NULL, 
          "hash" text NOT NULL, 
          "spec_version" character varying NULL, 
          "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, 
          CONSTRAINT "PK_d0925763efb591c2e2ffb267572" PRIMARY KEY ("id"))`)

        await db.query(`CREATE INDEX "IDX_f8fba63d7965bfee9f304c4870" ON "block" ("chain_id") `)
        await db.query(`CREATE INDEX "IDX_f8fba63d7965bfee9f304c487a" ON "block" ("hash") `)
        await db.query(`CREATE INDEX "IDX_5c67cbcf4960c1a39e5fe25e87" ON "block" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_5c67cbcf4960c1a39e5fe25e89" ON "block" ("spec_version") `)
        await db.query(`CREATE TABLE "event" (
          "chain_id" character varying NOT NULL, 
          "id" character varying NOT NULL, 
          "block_id" bigint NOT NULL, 
          "index" integer NOT NULL, 
          "extrinsic_id" text NOT NULL, 
          "section" text NOT NULL, 
          "method" text NOT NULL, 
          "signer_id" text NULL, 
          "data" text NOT NULL, 
          "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, 
          CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_a8a7fbbbb0d8305cd81eda6ac7" ON "event" ("chain_id") `)
        await db.query(`CREATE INDEX "IDX_a8a7fbbbb0d8305cd81eda6ac8" ON "event" ("block_id") `)
        await db.query(`CREATE INDEX "IDX_da3f402a04a5bf731cc20997a4" ON "event" ("index") `)
        await db.query(`CREATE INDEX "IDX_454df5a5a16bb99a92c08f7869" ON "event" ("signer_id") `)
        await db.query(`CREATE INDEX "IDX_454df5a5a16bb99a92c08f7870" ON "event" ("section") `)
        await db.query(`CREATE INDEX "IDX_f38992d3f393b04d1739fcb271" ON "event" ("method") `)
        await db.query(`CREATE INDEX "IDX_0c44a53b2623d4ad2e44d3c925" ON "event" ("data") `)
        await db.query(`CREATE INDEX "IDX_2c15918ff289396205521c5f3c" ON "event" ("timestamp") `)
        await db.query(`CREATE TABLE "extrinsic" (
          "chain_id" character varying NOT NULL, 
          "id" character varying NOT NULL, 
          "block_id" bigint NOT NULL, 
          "index" integer NOT NULL default 0, 
          "extrinsic_hash" text NOT NULL, 
          "signer_id" character varying NULL,
          "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, 
          "section" text NOT NULL, 
          "method" text NOT NULL, 
          "fee" numeric NOT NULL, 
          "success" boolean, 
          CONSTRAINT "PK_80d7db0e4b1e83e30336bc76755" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_142f352835c698a35eacbeb2f4" ON "extrinsic" ("chain_id") `)
        await db.query(`CREATE INDEX "IDX_142f352835c698a35eacbeb2f5" ON "extrinsic" ("block_id") `)
        await db.query(`CREATE INDEX "IDX_91b0c68a28f1eed15d736d7e11" ON "extrinsic" ("index") `)
        await db.query(`CREATE INDEX "IDX_1f45de0713a55049009e8e8127" ON "extrinsic" ("extrinsic_hash") `)
        // await db.query(`CREATE INDEX "IDX_129efedcb305c80256db2d57a5" ON "extrinsic" ("extrinsic_id") `)
        await db.query(`CREATE INDEX "IDX_6e232918078798b1fade21dcf8" ON "extrinsic" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_001ddf290faf765f9dfd9154d3" ON "extrinsic" ("signer_id") `)
        await db.query(`CREATE INDEX "IDX_f27ce26722a5bff4dad664d4cb" ON "extrinsic" ("section") `)
        await db.query(`CREATE INDEX "IDX_fee06ac3db4d6eaeab04d0e5eb" ON "extrinsic" ("method") `)
        await db.query(`CREATE INDEX "IDX_21e5db7671dfa1b00dbe6dbbd6" ON "extrinsic" ("success") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "block"`)
        await db.query(`DROP INDEX "public"."IDX_f8fba63d7965bfee9f304c4879"`)
        await db.query(`DROP INDEX "public"."IDX_f8fba63d7965bfee9f304c487a"`)
        await db.query(`DROP INDEX "public"."IDX_5c67cbcf4960c1a39e5fe25e87"`)
        await db.query(`DROP TABLE "event"`)
        await db.query(`DROP INDEX "public"."IDX_a8a7fbbbb0d8305cd81eda6ac7"`)
        await db.query(`DROP INDEX "public"."IDX_a8a7fbbbb0d8305cd81eda6ac8"`)
        await db.query(`DROP INDEX "public"."IDX_da3f402a04a5bf731cc20997a4"`)
        await db.query(`DROP INDEX "public"."IDX_129efedcb305c80256db2d57a5"`)
        await db.query(`DROP INDEX "public"."IDX_454df5a5a16bb99a92c08f7870"`)
        await db.query(`DROP INDEX "public"."IDX_f38992d3f393b04d1739fcb271"`)
        await db.query(`DROP INDEX "public"."IDX_0c44a53b2623d4ad2e44d3c925"`)
        await db.query(`DROP INDEX "public"."IDX_2c15918ff289396205521c5f3c"`)
        await db.query(`DROP TABLE "extrinsic"`)
        await db.query(`DROP INDEX "public"."IDX_142f352835c698a35eacbeb2f4"`)
        await db.query(`DROP INDEX "public"."IDX_142f352835c698a35eacbeb2f5"`)
        await db.query(`DROP INDEX "public"."IDX_91b0c68a28f1eed15d736d7e11"`)
        await db.query(`DROP INDEX "public"."IDX_1f45de0713a55049009e8e8127"`)
        await db.query(`DROP INDEX "public"."IDX_454df5a5a16bb99a92c08f7869"`)
        await db.query(`DROP INDEX "public"."IDX_6e232918078798b1fade21dcf8"`)
        await db.query(`DROP INDEX "public"."IDX_001ddf290faf765f9dfd9154d3"`)
        await db.query(`DROP INDEX "public"."IDX_f27ce26722a5bff4dad664d4cb"`)
        await db.query(`DROP INDEX "public"."IDX_fee06ac3db4d6eaeab04d0e5eb"`)
        await db.query(`DROP INDEX "public"."IDX_21e5db7671dfa1b00dbe6dbbd6"`)
    }
}
