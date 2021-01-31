import {MigrationInterface, QueryRunner} from "typeorm";

export class migrationV1101609999697116 implements MigrationInterface {
    name = 'migrationV1101609999697116'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION  IF NOT EXISTS postgis;`);
        await queryRunner.query(`CREATE TYPE "statuses_status_enum" AS ENUM('Pending', 'In-Progress', 'Completed', 'Failed')`);
        await queryRunner.query(`CREATE TABLE "statuses" ("id" SERIAL NOT NULL, "taskId" character varying NOT NULL, "userId" character varying NOT NULL, "fileName" character varying NOT NULL, "directoryName" character varying NOT NULL, "fileURI" character varying NOT NULL, "progress" integer NOT NULL, "status" "statuses_status_enum" NOT NULL, "geometry" geometry(Geometry,4326) NOT NULL, "estimatedFileSize" double precision NOT NULL, "realFileSize" double precision NOT NULL, "creationTime" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedTime" TIMESTAMP WITH TIME ZONE NOT NULL, "expirationTime" TIMESTAMP WITH TIME ZONE NOT NULL, "workerAttempts" integer NOT NULL DEFAULT 0, "maxZoom" integer NOT NULL DEFAULT 18, CONSTRAINT "PK_2fd3770acdb67736f1a3e3d5399" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "taskIndex" ON "statuses" ("taskId") `);
        await queryRunner.query(`CREATE INDEX "userIndex" ON "statuses" ("userId") `);
        await queryRunner.query(`CREATE INDEX "geometryIndex" ON "statuses" USING GiST ("geometry") `);
        await queryRunner.query(`CREATE INDEX "expirationTimeIndex" ON "statuses" ("expirationTime") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "pathIndex" ON "statuses" ("fileName", "directoryName") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "pathIndex"`);
        await queryRunner.query(`DROP INDEX "expirationTimeIndex"`);
        await queryRunner.query(`DROP INDEX "geometryIndex"`);
        await queryRunner.query(`DROP INDEX "userIndex"`);
        await queryRunner.query(`DROP INDEX "taskIndex"`);
        await queryRunner.query(`DROP TABLE "statuses"`);
        await queryRunner.query(`DROP TYPE "statuses_status_enum"`);
    }

}
