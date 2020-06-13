import {MigrationInterface, QueryRunner} from "typeorm";
import { Category } from "../entity/Category";
import { NecessityType } from "../entity/NecessityType";

export class AddNecessityTypes1587509055791 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        const data = [
            {
                name: "Hospitales"
            }
        ];

        queryRunner
        .manager
        .createQueryBuilder()
        .insert()
        .into(NecessityType)
        .values(data)
        .execute();

        const necessityTypes = await queryRunner
        .manager
        .createQueryBuilder()
        .select("necessityType")
        .from(NecessityType, "necessityType")
        .getMany();

        const necessityType = necessityTypes[0];

        const categories = await queryRunner
        .manager
        .createQueryBuilder()
        .select("category")
        .from(Category, "category")
        .getMany();

        await Promise.all(categories.map(async (category) => {
            await queryRunner
            .manager
            .createQueryBuilder()
            .relation(NecessityType, "categories")
            .of(necessityType.id)
            .add(category);
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        queryRunner
        .manager
        .createQueryBuilder()
        .delete()
        .from(Category)
        .execute();

        queryRunner
        .manager
        .createQueryBuilder()
        .delete()
        .from(NecessityType)
        .execute();
    }

}
