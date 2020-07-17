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

        const hospitalesType = necessityTypes.find(nt => nt.name.includes("Hospitales"));
        const aislamientoType = necessityTypes.find(nt => nt.name.includes("Aislamiento"));

        const categories = await queryRunner
        .manager
        .createQueryBuilder()
        .select("category")
        .from(Category, "category")
        .getMany();

        const saludCategory = categories.find(category => category.name.includes("Salud"));
        const pandemiaCategory = categories.find(category => category.name.includes("Pandemia"));

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

            if (necessity.name.includes('Camas para COVID-19')) {
                await queryRunner
                .manager
                .createQueryBuilder()
                .relation(Necessity, "category")
                .of(necessity.id)
                .set(saludCategory);

                await queryRunner
                .manager
                .createQueryBuilder()
                .relation(Category, "associatedNecessities")
                .of(saludCategory.id)
                .add(necessity);

                await queryRunner
                .manager
                .createQueryBuilder()
                .relation(Necessity, "type")
                .of(necessity.id)
                .set(hospitalesType);

                await queryRunner
                .manager
                .createQueryBuilder()
                .relation(NecessityType, "necessities")
                .of(hospitalesType.id)
                .add(necessity);
            }
            else {
                await queryRunner
                .manager
                .createQueryBuilder()
                .relation(Necessity, "category")
                .of(necessity.id)
                .set(pandemiaCategory);

                await queryRunner
                .manager
                .createQueryBuilder()
                .relation(Category, "associatedNecessities")
                .of(pandemiaCategory.id)
                .add(necessity);

                await queryRunner
                .manager
                .createQueryBuilder()
                .relation(Necessity, "type")
                .of(necessity.id)
                .set(aislamientoType);

                await queryRunner
                .manager
                .createQueryBuilder()
                .relation(NecessityType, "necessities")
                .of(aislamientoType.id)
                .add(necessity);
            }
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
