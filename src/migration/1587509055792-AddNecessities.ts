import {MigrationInterface, QueryRunner} from "typeorm";
import { Necessity } from "../entity/Necessity";
import * as necessityData from './seedData/necessities.json';
import { NecessityType } from "../entity/NecessityType";
import { Category } from "../entity/Category";

export class AddNecessities1587509055792 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        const data = JSON.parse(necessityData);

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

        const category = categories[0];

        queryRunner
        .manager
        .createQueryBuilder()
        .insert()
        .into(Necessity)
        .values(data)
        .execute();

        const necessities = await queryRunner
        .manager
        .createQueryBuilder()
        .select("necessity")
        .from(Necessity, "necessity")
        .getMany();

        await Promise.all(necessities.map(async (necessity) => {
            await queryRunner
            .manager
            .createQueryBuilder()
            .relation(Necessity, "category")
            .of(necessity.id)
            .set(category);

            await queryRunner
            .manager
            .createQueryBuilder()
            .relation(Category, "associatedNecessities")
            .of(category.id)
            .add(necessity);

            await queryRunner
            .manager
            .createQueryBuilder()
            .relation(Necessity, "type")
            .of(necessity.id)
            .set(necessityType);

            await queryRunner
            .manager
            .createQueryBuilder()
            .relation(NecessityType, "necessities")
            .of(necessityType.id)
            .add(necessity);
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        queryRunner
        .manager
        .createQueryBuilder()
        .delete()
        .from(Necessity)
        .execute();
    }

}
