import {MigrationInterface, QueryRunner} from "typeorm";
import { User } from "../entity/User";

export class AddAdminUser1588897875434 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let user = new User();
        user.email = "admin@gmail.com";
        user.password = "admin";
        user.hashPassword();
        user.phone = "1145678345";
        await user.save();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
