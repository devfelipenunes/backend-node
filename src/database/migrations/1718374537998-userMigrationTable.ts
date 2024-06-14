import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class userMigrationTable1718374537998 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            generationStrategy: "increment",
          },
          {
            name: "email",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "password",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "metamaskAddress",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "isContentCreator",
            type: "boolean",
            default: false,
          },
          {
            name: "monthlySubscriptionPrice",
            type: "integer",
            isNullable: true,
          },
          {
            name: "stripeProductId",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "stripePriceId",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "is_subscribed",
            type: "boolean",
            default: false,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }
}
