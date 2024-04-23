import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class Initial1713699934358 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Permission Categories
    await queryRunner.query(
      `CREATE TABLE "permission_categories" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(512) NOT NULL, "description" character varying(1024) NOT NULL, CONSTRAINT "PK_74d37787e3657c0a4f38501fd8c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_8e1185e3ede34595b0d87a6381" ON "permission_categories" ("name") `,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."roles_role_type_enum" AS ENUM('SUPER_ADMIN', 'ADMIN', 'REGULAR_USER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(512) NOT NULL, "description" character varying(1024) NOT NULL, "role_type" "public"."roles_role_type_enum", "user_id" uuid, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_roles_permissions" ("role_id" uuid NOT NULL, "permission_id" uuid NOT NULL, CONSTRAINT "PK_f14c467261057c9963c1cb0025b" PRIMARY KEY ("role_id", "permission_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_196638fa4ae8b458527eaf1e7d" ON "user_roles_permissions" ("role_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5114c23669f9b3ce2ec00ae0ca" ON "user_roles_permissions" ("permission_id") `,
    );
    // Permissions
    await queryRunner.query(
      `CREATE TABLE "permissions" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(256) NOT NULL, "description" character varying(1024), "action" character varying(256) NOT NULL, "permission_category_id" uuid NOT NULL, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_1c1e0637ecf1f6401beb9a68ab" ON "permissions" ("action") `,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."user_status_enum" AS ENUM('ACTIVE', 'WAITING_FOR_ADMIN_APPROVAL', 'DEACTIVATED')`,
    );
    // User
    await queryRunner.query(
      `CREATE TABLE "users" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(320) NOT NULL, "password" character varying(256), "name" character varying(256) NOT NULL, "surname" character varying(256) NOT NULL, "status" "public"."user_status_enum" NOT NULL, CONSTRAINT "UQ_e336cc51b61c40b1b1731308aa5" UNIQUE ("email"), CONSTRAINT "PK_f44d0cd18cfd80b0fed7806c3b7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e336cc51b61c40b1b1731308aa" ON "users" ("email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users_roles" ("user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_c525e9373d63035b9919e578a9c" PRIMARY KEY ("user_id", "role_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e4435209df12bc1f001e536017" ON "users_roles" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1cf664021f00b9cc1ff95e17de" ON "users_roles" ("role_id") `,
    );
    // Establish foreign key relationship
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "FK_e59a01f4fe46ebbece575d9a0fc" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD CONSTRAINT "FK_7e41ca1f8d46cafff6d16388cec" FOREIGN KEY ("permission_category_id") REFERENCES "permission_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_permissions" ADD CONSTRAINT "FK_196638fa4ae8b458527eaf1e7d4" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_permissions" ADD CONSTRAINT "FK_5114c23669f9b3ce2ec00ae0ca4" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles" ADD CONSTRAINT "FK_e4435209df12bc1f001e5360174" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles" ADD CONSTRAINT "FK_1cf664021f00b9cc1ff95e17de4" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_roles_permissions" DROP CONSTRAINT "FK_5114c23669f9b3ce2ec00ae0ca4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_permissions" DROP CONSTRAINT "FK_196638fa4ae8b458527eaf1e7d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles" DROP CONSTRAINT "FK_1cf664021f00b9cc1ff95e17de4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles" DROP CONSTRAINT "FK_e4435209df12bc1f001e5360174"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "FK_e59a01f4fe46ebbece575d9a0fc"`,
    );
    // Permissions
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP CONSTRAINT "FK_7e41ca1f8d46cafff6d16388cec"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1c1e0637ecf1f6401beb9a68ab"`,
    );
    await queryRunner.query(`DROP TABLE "permissions"`);

    // Permission Categories
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8e1185e3ede34595b0d87a6381"`,
    );
    await queryRunner.query(`DROP TABLE "permission_categories"`);

    // User
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e336cc51b61c40b1b1731308aa"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."user_profile_status_enum"`);
  }
}
