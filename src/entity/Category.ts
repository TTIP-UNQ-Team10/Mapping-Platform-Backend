import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Length } from "class-validator";
import { NecessityType } from './NecessityType';
import { Necessity } from './Necessity';

@Entity('Category')
export class Category extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', unique: true })
    @Length(4, 100)
    name: string;

    @ManyToOne(type => NecessityType, necessityType => necessityType.categories, { nullable: true })
    necessityType: NecessityType;

    @OneToMany(type => Necessity, necessity => necessity.category, { nullable: true })
    associatedNecessities: Necessity[];

    @CreateDateColumn()
    created_at: string;

    @UpdateDateColumn()
    updated_at: string;

    static async findByName(name: string) {
        return await Category.findOne({ where: { name: name } });
    }
}