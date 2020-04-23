import {MigrationInterface, QueryRunner} from "typeorm";
import { Necessity } from "../entity/Necessity";
import * as necessityData from './seedData/necessities.json';

export class AddNecessities1587509055792 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        const data = JSON.parse(necessityData);

        queryRunner
        .manager
        .createQueryBuilder()
        .insert()
        .into(Necessity)
        .values(data)
        .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        queryRunner
        .manager
        .createQueryBuilder()
        .delete()
        .from(Necessity)
    }

}
