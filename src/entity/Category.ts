import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Length } from "class-validator";

@Entity('Category')
export class Category extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar' })
    @Length(4, 100)
    name: string;

    @Column('simple-json')
    subCategory: { name: string };

    @CreateDateColumn()
    created_at: string;

    @UpdateDateColumn()
    updated_at: string;
}