import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm";
import { Category } from "./Category";
import { Length } from "class-validator";
import { NecessityType } from "./NecessityType";

export type LocationType = "marker" | "polygon" | "circle" | "rectangle";

@Entity('Necessity')
export class Necessity extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: number;
    
    @Column({ type: 'varchar' })
    @Length(4, 100)
    name: string;

    @ManyToOne(type => NecessityType, necessityType => necessityType.necessities, { eager: true, cascade: true })
    type: NecessityType;

    @ManyToOne(type => Category, category => category.associatedNecessities, { eager: true, cascade: true })
    category: Category

    @Column({ type: 'varchar', length: 1000, nullable: true })
    @Length(4, 1000)
    description: string;

    @Column('simple-array', { nullable: true })
    photos: string[];

    @Column('simple-json')
    location: { type: LocationType, coordinates: any[], properties: object };
}
