import {MigrationInterface, QueryRunner} from "typeorm";

export class init1644824910972 implements MigrationInterface {
    name = 'init1644824910972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "api_keys" ("id" SERIAL NOT NULL, "key" character varying(128) NOT NULL, CONSTRAINT "UQ_e42cf55faeafdcce01a82d24849" UNIQUE ("key"), CONSTRAINT "PK_5c8a79801b44bd27b79228e1dad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e42cf55faeafdcce01a82d2484" ON "api_keys" ("key") `);
        await queryRunner.query(`CREATE TABLE "api_key_history" ("id" SERIAL NOT NULL, "apiId" integer NOT NULL, "message" character varying(128) NOT NULL, "weight" integer NOT NULL DEFAULT '0', "time" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6dad973eabd64cb29b8ac570fd8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "api_key_history" ADD CONSTRAINT "FK_f2dbbb4a72456fd78deb927577e" FOREIGN KEY ("apiId") REFERENCES "api_keys"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api_key_history" DROP CONSTRAINT "FK_f2dbbb4a72456fd78deb927577e"`);
        await queryRunner.query(`DROP TABLE "api_key_history"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e42cf55faeafdcce01a82d2484"`);
        await queryRunner.query(`DROP TABLE "api_keys"`);
    }

}
