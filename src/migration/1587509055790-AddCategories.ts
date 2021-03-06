import {MigrationInterface, QueryRunner} from "typeorm";
import { Category } from "../entity/Category";

export class AddCategories1587509055790 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        const data = [
            {
                name: "Salud"
            },
            {
                name: "Pandemia"
            }
        ];

        queryRunner
        .manager
        .createQueryBuilder()
        .insert()
        .into(Category)
        .values(data)
        .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        
    }

}
