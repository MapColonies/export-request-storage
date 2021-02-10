import {MigrationInterface, QueryRunner} from "typeorm";

export class migrationV1301612960528942 implements MigrationInterface {
    name = 'migrationV1301612960528942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statuses" ADD "sourceLayer" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statuses" DROP COLUMN "sourceLayer"`);
    }

}
