import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { Category } from "./Category";
import { Length } from "class-validator";
import { Necessity } from "./Necessity";

@Entity('NecessityType')
export class NecessityType extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: number;
    
    @Column({ type: 'varchar', unique: true })
    @Length(4, 100)
    name: string;

    @OneToMany(type => Necessity, necessity => necessity.type, { nullable: true })
    necessities: Necessity[]

    @OneToMany(type => Category, category => category.necessityType, { nullable: true, eager: true })
    categories: Category[]

    static async findByName(name: string) {
        return await NecessityType.findOne({ where: { name: name } });
    }
}
