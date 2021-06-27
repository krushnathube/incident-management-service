import { MigrationInterface, QueryRunner } from "typeorm";

export class createSchema1623864976933 implements MigrationInterface {
  title = "createSchema1623864976933";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying(20) NOT NULL, "passwordHash" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "incidents_type_enum" AS ENUM('employee', 'environmental', 'property', 'vehicle', 'fire')`
    );
    await queryRunner.query(
      `CREATE TABLE "incidents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(60) NOT NULL, "assigneeId" uuid,"description" character varying(60), "type" "incidents_type_enum" NOT NULL DEFAULT 'employee', "isResolved" boolean NOT NULL DEFAULT false, "closedById" uuid, "closedAt" TIMESTAMP, "isAcknowledged" boolean NOT NULL DEFAULT false, "acknowledgedById" uuid, "acknowledgedAt" TIMESTAMP, "createdById" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedById" uuid, "updatedAt" TIMESTAMP, CONSTRAINT "PK_dadac7f01b703d50496ae1d3e74" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "notes" ("id" SERIAL NOT NULL, "body" character varying NOT NULL, "authorId" uuid NOT NULL, "incidentId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" ADD CONSTRAINT "FK_f55144dc92df43cd1dad5d29b90" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" ADD CONSTRAINT "FK_5748f0f4995f9530bf174a068af" FOREIGN KEY ("closedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" ADD CONSTRAINT "FK_2e4e579ff84e2e8ee880be824d4" FOREIGN KEY ("acknowledgedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" ADD CONSTRAINT "FK_df9f856721165a7d9e57705fb26" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_d358080cb403fe88e62cc9cba58" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_80e0afbc05b34045e45ad183775" FOREIGN KEY ("incidentId") REFERENCES "incidents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "incidents" DROP CONSTRAINT "FK_df9f856721165a7d9e57705fb26"`
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" DROP CONSTRAINT "FK_2e4e579ff84e2e8ee880be824d4"`
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" DROP CONSTRAINT "FK_5748f0f4995f9530bf174a068af"`
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_80e0afbc05b34045e45ad183775"`
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_d358080cb403fe88e62cc9cba58"`
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" DROP CONSTRAINT "FK_f55144dc92df43cd1dad5d29b90"`
    );
    await queryRunner.query(`DROP TABLE "notes"`);
    await queryRunner.query(`DROP TABLE "incidents"`);
    await queryRunner.query(`DROP TYPE "incidents_type_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
