import {MigrationInterface, QueryRunner} from "typeorm";
import { Category } from "../entity/Category";
import { NecessityType } from "../entity/NecessityType";

export class AddNecessityTypes1587509055791 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        const data = [
            {
                name: "Hospitales"
            },
            {
                name: "Aislamiento"
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
            
        await queryRunner
        .manager
        .createQueryBuilder()
        .relation(NecessityType, "categories")
        .of(hospitalesType.id)
        .add(saludCategory);
            
        await queryRunner
        .manager
        .createQueryBuilder()
        .relation(NecessityType, "categories")
        .of(aislamientoType.id)
        .add(pandemiaCategory);
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
