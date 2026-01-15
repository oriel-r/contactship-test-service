import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLeadsTable1768462909516 implements MigrationInterface {
    name = 'CreateLeadsTable1768462909516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "leads" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "email" character varying NOT NULL, "phone" character varying(50), "age" integer, "city" character varying(50) NOT NULL, "country" character varying(50) NOT NULL, "summary" text, "next_action" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b3eea7add0e16594dba102716c5" UNIQUE ("email"), CONSTRAINT "PK_cd102ed7a9a4ca7d4d8bfeba406" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b3eea7add0e16594dba102716c" ON "leads" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_b3eea7add0e16594dba102716c"`);
        await queryRunner.query(`DROP TABLE "leads"`);
    }

}
