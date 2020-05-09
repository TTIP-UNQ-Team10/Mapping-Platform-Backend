import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Length } from "class-validator";
import * as bcrypt from "bcryptjs";

@Entity('User')
export class User extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar' })
    @Length(4, 100)
    password: string;

    @Column({ type: 'varchar' })
    email: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    phone: string;

    @CreateDateColumn()
    created_at: string;

    @UpdateDateColumn()
    updated_at: string;

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }
    
    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}