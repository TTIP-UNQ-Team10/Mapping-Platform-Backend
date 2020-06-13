import {MigrationInterface, QueryRunner} from "typeorm";
import { User } from "../entity/User";

export class AddAdminUser1587509055789 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let user = new User();
        user.email = "admin@gmail.com";
        user.password = "admin";
        user.hashPassword();
        user.phone = "1145678345";
        await user.save();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        queryRunner
        .manager
        .createQueryBuilder()
        .delete()
        .from(User)
        .execute();
    }

}
